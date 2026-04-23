import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workflowId } = await params;

  // Verify the user has write access to the workflow
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

  const updated = await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      isTemplate: true,
      updatedAt: new Date(),
    },
  });

  return Response.json(updated);
}
