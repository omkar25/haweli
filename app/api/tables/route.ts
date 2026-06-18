import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const tables = await prisma.table.findMany({
    orderBy: { number: "asc" },
  });

  return NextResponse.json(tables);
}
