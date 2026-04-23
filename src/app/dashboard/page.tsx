import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/default-user";
import Link from "next/link";
import { CreateProjectDialog } from "@/components/layout/create-project-dialog";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const dynamic = "force-dynamic";

interface ProjectWithCount {
  id: string;
  name: string;
  description: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  _count: { workflows: number };
}

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export default async function DashboardPage() {
  const user = await getDefaultUser();

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } },
      ],
    },
    include: {
      _count: {
        select: { workflows: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-xl font-bold text-foreground">
            TenX Mapper
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Press Ctrl+K to search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search...
              <kbd className="ml-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium font-mono">
                Ctrl K
              </kbd>
            </div>
            <Link
              href="/templates"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Templates
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading row */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {projects.length > 0
                ? `${projects.length} project${projects.length === 1 ? "" : "s"}`
                : "Create a project to get started"}
            </p>
          </div>
          <CreateProjectDialog />
        </div>

        {/* Projects grid or empty state */}
        {projects.length === 0 ? (
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
                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-semibold text-card-foreground">
              No projects yet
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Create your first project to start mapping workflows.
            </p>
            <CreateProjectDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: ProjectWithCount) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-ring/30 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-base font-semibold text-card-foreground group-hover:text-primary">
                    {project.name}
                  </h3>
                </div>

                {project.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>
                    {project._count.workflows} workflow{project._count.workflows !== 1 ? "s" : ""}
                  </span>
                  <span className="ml-auto">
                    {timeAgo(new Date(project.updatedAt))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
