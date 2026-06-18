import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET full menu grouped by category
export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      items: { orderBy: { name: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

// POST create a menu item
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, isVeg, categoryId, image } = body;

  const item = await prisma.menuItem.create({
    data: { name, description, price, isVeg, categoryId, image },
  });

  return NextResponse.json(item, { status: 201 });
}
