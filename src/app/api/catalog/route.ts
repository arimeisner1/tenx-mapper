import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const entries = await prisma.softwareCatalog.findMany({
    where: category ? { category } : undefined,
    orderBy: { name: "asc" },
  });

  return Response.json(entries);
}
