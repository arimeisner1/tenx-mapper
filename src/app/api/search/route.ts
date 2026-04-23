import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/default-user";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return Response.json({ projects: [], workflows: [], tools: [] });
  }

  const user = await getDefaultUser();

  const [projects, workflows, tools] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { collaborators: { some: { userId: user.id } } },
        ],
        AND: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),

    prisma.workflow.findMany({
      where: {
        project: {
          OR: [
            { ownerId: user.id },
            { collaborators: { some: { userId: user.id } } },
          ],
        },
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        project: {
          select: { id: true, name: true },
        },
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),

    prisma.softwareCatalog.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        category: true,
        logoUrl: true,
      },
      take: 5,
      orderBy: { name: "asc" },
    }),
  ]);

  return Response.json({ projects, workflows, tools });
}
