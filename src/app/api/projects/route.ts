import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { collaborators: { some: { userId: session.user.id } } },
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
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description } = body;

  if (!name || typeof name !== "string") {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      ownerId: session.user.id,
      collaborators: {
        create: {
          userId: session.user.id,
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
