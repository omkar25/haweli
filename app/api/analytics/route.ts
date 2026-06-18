import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total revenue today
    const todayOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: today },
        status: { in: ["COMPLETED", "SERVED"] },
      },
    });
    const todayRevenue = todayOrders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

    // Total orders today
    const totalOrdersToday = await prisma.order.count({
      where: { createdAt: { gte: today } },
    });

    // Top dishes (all time)
    const topDishes = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    const topDishDetails = await Promise.all(
      topDishes.map(async (d: { menuItemId: string; _sum: { quantity: number } }) => {
        const item = await prisma.menuItem.findUnique({
          where: { id: d.menuItemId },
        });
        return {
          name: item?.name,
          totalOrdered: d._sum.quantity,
        };
      })
    );

    // Table status overview
    const tables = await prisma.table.findMany({
      orderBy: { number: "asc" },
    });

    // Active orders count
    const activeOrders = await prisma.order.count({
      where: { status: { in: ["PENDING", "PREPARING"] } },
    });

    return NextResponse.json({
      todayRevenue,
      totalOrdersToday,
      activeOrders,
      topDishes: topDishDetails,
      tables,
    });
  } catch (error) {
    console.error("[analytics] Error:", error);
    return NextResponse.json(
      {
        todayRevenue: 0,
        totalOrdersToday: 0,
        activeOrders: 0,
        topDishes: [],
        tables: [],
      },
      { status: 200 }
    );
  }
}
