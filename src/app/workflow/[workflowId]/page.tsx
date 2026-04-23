import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WorkflowCanvas } from "@/components/canvas/workflow-canvas";

interface WorkflowPageProps {
  params: Promise<{ workflowId: string }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
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
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!workflow) {
    notFound();
  }

  const catalog = await prisma.softwareCatalog.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <WorkflowCanvas
      workflow={{
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        canvasData: workflow.canvasData as Record<string, unknown>,
        projectId: workflow.project.id,
        projectName: workflow.project.name,
        nodeMetadata: workflow.nodeMetadata,
      }}
      catalog={catalog}
    />
  );
}
