import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/default-user";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const user = await getDefaultUser();

  const { workflowId } = await params;

  // Verify the user has write access to the workflow
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      project: {
        OR: [
          { ownerId: user.id },
          {
            collaborators: {
              some: {
                userId: user.id,
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
