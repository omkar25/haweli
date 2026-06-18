import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

// GET all orders (with optional status filter)
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: {
      items: { include: { menuItem: true } },
      table: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST create a new order
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tableNumber, items } = body;

  const table = await prisma.table.findUnique({
    where: { number: tableNumber },
  });

  if (!table) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: items.map((i: { menuItemId: string }) => i.menuItemId) } },
  });

  const total = items.reduce(
    (sum: number, item: { menuItemId: string; quantity: number }) => {
      const menuItem = menuItems.find((m: { id: string; price: number }) => m.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    },
    0
  );

  const order = await prisma.order.create({
    data: {
      tableId: table.id,
      total,
      items: {
        create: items.map((item: { menuItemId: string; quantity: number }) => {
          const menuItem = menuItems.find((m: { id: string; price: number }) => m.id === item.menuItemId);
          return {
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: menuItem?.price || 0,
          };
        }),
      },
    },
    include: { items: { include: { menuItem: true } }, table: true },
  });

  // Update table status
  await prisma.table.update({
    where: { id: table.id },
    data: { status: "OCCUPIED" },
  });

  // Real-time notification
  await pusherServer.trigger(CHANNELS.KITCHEN, EVENTS.NEW_ORDER, order);

  return NextResponse.json(order, { status: 201 });
}
