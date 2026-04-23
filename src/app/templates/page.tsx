import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";
import { UseTemplateButton } from "@/components/canvas/use-template-button";

export default async function TemplatesPage() {
  const user = await getDefaultUser();

  const templates = await prisma.workflow.findMany({
    where: {
      isTemplate: true,
      project: {
        OR: [
          { ownerId: user.id },
          { collaborators: { some: { userId: user.id } } },
        ],
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { nodeMetadata: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch user's projects for the "Use Template" action
  const projects = await prisma.project.findMany({
    where: {
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
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-foreground"
            >
              TenX Mapper
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/templates"
                className="rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-foreground"
              >
                Templates
              </Link>
            </nav>
          </div>
          <UserMenu
            user={{
              name: user.name,
              email: user.email,
              image: user.avatarUrl,
            }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {templates.length > 0
              ? `${templates.length} template${templates.length === 1 ? "" : "s"} available`
              : "Save a workflow as a template from the canvas"}
          </p>
        </div>

        {/* Templates grid or empty state */}
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-7 w-7 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-semibold text-card-foreground">
              No templates yet
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Save a workflow as a template from the canvas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template: (typeof templates)[number]) => (
              <div
                key={template.id}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-ring/30 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-card-foreground">
                      {template.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      from {template.project.name}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    Template
                  </span>
                </div>

                {template.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {template.description}
                  </p>
                )}

                <div className="mb-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"
                      />
                    </svg>
                    {template._count.nodeMetadata} node
                    {template._count.nodeMetadata !== 1 ? "s" : ""}
                  </span>
                </div>

                <UseTemplateButton
                  templateId={template.id}
                  projects={projects}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
