import { prisma } from "@/lib/prisma";
import { ShareCanvas } from "./share-canvas";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;

  const workflow = await prisma.workflow.findUnique({
    where: { shareToken: token },
    include: {
      project: {
        select: {
          name: true,
        },
      },
      nodeMetadata: true,
    },
  });

  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-muted-foreground/30">404</div>
          <h1 className="text-xl font-semibold">Workflow not found</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            This shared workflow link is invalid or has been removed. Please
            check the URL or contact the person who shared it with you.
          </p>
        </div>
      </div>
    );
  }

  const canvasData = workflow.canvasData as { nodes: unknown[]; edges: unknown[] };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-semibold">{workflow.name}</h1>
          <p className="text-xs text-muted-foreground">
            {workflow.project.name}
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Shared view &mdash; read only
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ShareCanvas
          nodes={canvasData.nodes || []}
          edges={canvasData.edges || []}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card px-4 py-2 text-center shrink-0">
        <a
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Made with <span className="font-semibold">TenX Mapper</span>
        </a>
      </div>
    </div>
  );
}
