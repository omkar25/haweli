import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

// PATCH update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { menuItem: true } }, table: true },
  });

  // If completed/cancelled, free the table
  if (status === "COMPLETED" || status === "CANCELLED") {
    const activeOrders = await prisma.order.count({
      where: {
        tableId: order.tableId,
        status: { in: ["PENDING", "PREPARING", "SERVED"] },
      },
    });

    if (activeOrders === 0) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: { status: "AVAILABLE" },
      });
    }
  }

  // Real-time notification
  await pusherServer.trigger(CHANNELS.KITCHEN, EVENTS.ORDER_UPDATED, order);

  // When order is SERVED → notify customer via web (Pusher)
  if (status === "SERVED") {
    const tableNumber = (order.table as { number: number })?.number;
    await pusherServer.trigger(CHANNELS.ORDERS, EVENTS.ORDER_READY, {
      orderId: id,
      tableNumber,
      message: `✅ Ihre Bestellung für Tisch ${tableNumber} ist fertig! Der Kellner bringt sie gleich.`,
    });
  }

  return NextResponse.json(order);
}
