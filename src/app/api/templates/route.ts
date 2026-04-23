import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { templateId, projectId, name } = body;

  if (!templateId || !projectId) {
    return Response.json(
      { error: "templateId and projectId are required" },
      { status: 400 }
    );
  }

  // Verify the user has access to the template workflow
  const template = await prisma.workflow.findFirst({
    where: {
      id: templateId,
      isTemplate: true,
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

  if (!template) {
    return Response.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  // Verify the user has write access to the target project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
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
  });

  if (!project) {
    return Response.json(
      { error: "Project not found or insufficient permissions" },
      { status: 404 }
    );
  }

  // Create new workflow from template
  const workflow = await prisma.workflow.create({
    data: {
      name: name || `${template.name} (Copy)`,
      description: template.description,
      canvasData: template.canvasData ?? { nodes: [], edges: [] },
      projectId,
      shareToken: nanoid(12),
      nodeMetadata: {
        create: template.nodeMetadata.map((meta: typeof template.nodeMetadata[number]) => ({
          nodeId: meta.nodeId,
          name: meta.name,
          description: meta.description,
          notes: meta.notes,
          links: meta.links ?? [],
          costEstimate: meta.costEstimate,
          apiEndpoint: meta.apiEndpoint,
          status: meta.status,
          customFields: meta.customFields ?? {},
        })),
      },
    },
    include: {
      nodeMetadata: true,
    },
  });

  return Response.json(workflow, { status: 201 });
}
