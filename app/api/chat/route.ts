import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAIResponse, parseOrderFromResponse } from "@/lib/waiter";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json();

  let session;
  if (sessionId) {
    session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
  }

  if (!session) {
    session = await prisma.chatSession.create({
      data: { phone: `web-${Date.now()}` },
    });
  }

  const reply = await getAIResponse(session.id, message);

  // Check if the AI placed an order
  const orderData = parseOrderFromResponse(reply);
  let invoice = null;

  if (orderData) {
    const tableNumber = orderData.tableNumber || 1;
    const table = await prisma.table.findUnique({ where: { number: tableNumber } });

    if (table) {
      const menuItems = await prisma.menuItem.findMany({
        where: {
          name: { in: orderData.items.map((i: { name: string }) => i.name) },
        },
      });

      // Calculate total and build order items
      const orderItems = orderData.items.map((item: { name: string; quantity: number }) => {
        const menuItem = menuItems.find((m: { name: string }) => m.name === item.name);
        return {
          menuItemId: menuItem?.id,
          quantity: item.quantity || 1,
          price: menuItem?.price || 0,
          name: item.name,
        };
      }).filter((item: { menuItemId?: string }) => item.menuItemId);

      const total = orderItems.reduce(
        (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
        0
      );

      const order = await prisma.order.create({
        data: {
          tableId: table.id,
          total,
          items: {
            create: orderItems.map((item: { menuItemId: string; quantity: number; price: number }) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: { include: { menuItem: true } }, table: true },
      });

      // Notify kitchen in real-time
      await pusherServer.trigger(CHANNELS.KITCHEN, EVENTS.NEW_ORDER, order);

      // Update table status
      await prisma.table.update({
        where: { id: table.id },
        data: { status: "OCCUPIED" },
      });

      // Build invoice
      invoice = {
        orderId: order.id,
        table: tableNumber,
        items: order.items.map((item: { menuItem: { name: string }; quantity: number; price: number }) => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        total: order.total,
        createdAt: order.createdAt,
      };
    }
  }

  // Clean the reply — remove JSON from customer-facing message
  const cleanReply = reply.replace(/\{"action":"place_order".*?\}/s, "").trim();

  return NextResponse.json({
    reply: cleanReply,
    sessionId: session.id,
    invoice,
    orderComplete: !!invoice,
  });
}
