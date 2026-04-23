import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/default-user";

export async function GET() {
  const user = await getDefaultUser();

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } },
      ],
    },
    include: {
      _count: {
        select: {
          workflows: true,
          collaborators: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(request: NextRequest) {
  const user = await getDefaultUser();

  const body = await request.json();
  const { name, description } = body;

  if (!name || typeof name !== "string") {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      ownerId: user.id,
      collaborators: {
        create: {
          userId: user.id,
          role: "owner",
        },
      },
    },
    include: {
      collaborators: true,
    },
  });

  return Response.json(project, { status: 201 });
}
