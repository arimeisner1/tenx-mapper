import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/default-user";
import { nanoid } from "nanoid";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const user = await getDefaultUser();
  const { workflowId } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      project: {
        OR: [
          { ownerId: user.id },
          { collaborators: { some: { userId: user.id } } },
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

  const duplicate = await prisma.workflow.create({
    data: {
      name: `${workflow.name} (Copy)`,
      description: workflow.description,
      canvasData: workflow.canvasData as object,
      isTemplate: false,
      shareToken: nanoid(12),
      tags: workflow.tags as object,
      projectId: workflow.projectId,
      nodeMetadata: {
        create: workflow.nodeMetadata.map((m) => ({
          nodeId: m.nodeId,
          name: m.name,
          description: m.description,
          notes: m.notes,
          links: m.links as object,
          costEstimate: m.costEstimate,
          apiEndpoint: m.apiEndpoint,
          status: m.status,
          customFields: m.customFields as object,
        })),
      },
    },
    include: {
      nodeMetadata: true,
    },
  });

  return Response.json(duplicate, { status: 201 });
}
