import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
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
          { collaborators: { some: { userId: session.user.id } } },
        ],
      },
    },
  });

  if (!workflow) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const {
    nodeId,
    name,
    description,
    notes,
    links,
    costEstimate,
    apiEndpoint,
    status,
    customFields,
  } = body;

  if (!nodeId || !name) {
    return Response.json(
      { error: "nodeId and name are required" },
      { status: 400 }
    );
  }

  const metadata = await prisma.nodeMetadata.upsert({
    where: {
      workflowId_nodeId: {
        workflowId,
        nodeId,
      },
    },
    create: {
      workflowId,
      nodeId,
      name,
      description: description || null,
      notes: notes || null,
      links: links || [],
      costEstimate: costEstimate || null,
      apiEndpoint: apiEndpoint || null,
      status: status || "active",
      customFields: customFields || {},
    },
    update: {
      name,
      ...(description !== undefined && { description }),
      ...(notes !== undefined && { notes }),
      ...(links !== undefined && { links }),
      ...(costEstimate !== undefined && { costEstimate }),
      ...(apiEndpoint !== undefined && { apiEndpoint }),
      ...(status !== undefined && { status }),
      ...(customFields !== undefined && { customFields }),
    },
  });

  return Response.json(metadata);
}

export async function DELETE(
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
          { collaborators: { some: { userId: session.user.id } } },
        ],
      },
    },
  });

  if (!workflow) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { nodeId } = body;

  if (!nodeId) {
    return Response.json({ error: "nodeId is required" }, { status: 400 });
  }

  await prisma.nodeMetadata.delete({
    where: {
      workflowId_nodeId: {
        workflowId,
        nodeId,
      },
    },
  });

  return Response.json({ success: true });
}
