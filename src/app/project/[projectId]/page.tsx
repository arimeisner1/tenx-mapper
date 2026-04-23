import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateWorkflowDialog } from "@/components/layout/create-workflow-dialog";
import { ProjectActions } from "./project-actions";
import {
  ArrowLeft,
  Clock,
  GitBranch,
  Users,
  Workflow as WorkflowIcon,
} from "lucide-react";

interface WorkflowItem {
  id: string;
  name: string;
  description: string | null;
  updatedAt: Date;
}

interface CollaboratorItem {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: session.user.id },
        { collaborators: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      workflows: {
        orderBy: { updatedAt: "desc" },
      },
      collaborators: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const isOwner = project.ownerId === session.user.id;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Link
                href="/dashboard"
                className="mt-1 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {project.name}
                </h1>
                {project.description && (
                  <p className="mt-1 text-muted-foreground text-sm max-w-xl">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
            {isOwner && (
              <ProjectActions
                projectId={project.id}
                projectName={project.name}
                projectDescription={project.description}
                archived={project.archived}
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="rounded-md bg-primary/10 p-2">
              <WorkflowIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{project.workflows.length}</p>
              <p className="text-xs text-muted-foreground">
                {project.workflows.length === 1 ? "Workflow" : "Workflows"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="rounded-md bg-primary/10 p-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{project.collaborators.length}</p>
              <p className="text-xs text-muted-foreground">
                {project.collaborators.length === 1 ? "Collaborator" : "Collaborators"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="rounded-md bg-primary/10 p-2">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{formatDate(project.updatedAt)}</p>
              <p className="text-xs text-muted-foreground">Last Updated</p>
            </div>
          </div>
        </div>

        {/* Workflows Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-muted-foreground" />
              Workflows
            </h2>
            <CreateWorkflowDialog projectId={project.id} />
          </div>

          {project.workflows.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <WorkflowIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No workflows yet.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first workflow to start mapping integrations.
                </p>
                <div className="mt-4">
                  <CreateWorkflowDialog projectId={project.id} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.workflows.map((workflow: WorkflowItem) => (
                <Link key={workflow.id} href={`/workflow/${workflow.id}`}>
                  <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {workflow.name}
                      </CardTitle>
                      {workflow.description && (
                        <CardDescription className="line-clamp-2">
                          {workflow.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(workflow.updatedAt)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Collaborators Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Collaborators
            </h2>
            {isOwner && (
              <Button variant="outline" size="sm">
                Invite
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {project.collaborators.map((collab: CollaboratorItem) => (
                <div
                  key={collab.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {collab.user.avatarUrl && (
                        <AvatarImage src={collab.user.avatarUrl} />
                      )}
                      <AvatarFallback className="text-xs">
                        {getInitials(collab.user.name, collab.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {collab.user.name || collab.user.email}
                      </p>
                      {collab.user.name && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {collab.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={collab.role === "owner" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {collab.role}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
