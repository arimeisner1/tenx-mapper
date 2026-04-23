import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workflowId } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      project: {
        OR: [
          { ownerId: session.user.id },
          { collaborators: { some: { userId: session.user.id } } },
        ],
      },
    },
    include: {
      nodeMetadata: true,
    },
  });

  if (!workflow) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(workflow);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workflowId } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      project: {
        OR: [
          { ownerId: session.user.id },
          {
            collaborators: {
              some: {
                userId: session.user.id,
                role: { in: ["owner", "editor"] },
              },
            },
          },
        ],
      },
    },
  });

  if (!workflow) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { name, description, canvasData } = body;

  const updated = await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(canvasData !== undefined && { canvasData }),
      updatedAt: new Date(),
    },
  });

  return Response.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workflowId } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      project: {
        OR: [
          { ownerId: session.user.id },
          {
            collaborators: {
              some: {
                userId: session.user.id,
                role: { in: ["owner", "editor"] },
              },
            },
          },
        ],
      },
    },
  });

  if (!workflow) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.workflow.delete({ where: { id: workflowId } });

  return Response.json({ success: true });
}
