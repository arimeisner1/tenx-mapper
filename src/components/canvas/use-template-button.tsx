"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UseTemplateButtonProps {
  templateId: string;
  projects: { id: string; name: string }[];
}

export function UseTemplateButton({
  templateId,
  projects,
}: UseTemplateButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  const handleUseTemplate = async (projectId: string) => {
    setLoading(true);
    setShowProjectPicker(false);

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, projectId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create workflow from template");
      }

      const workflow = await res.json();
      toast.success("Workflow created from template!");
      router.push(`/workflow/${workflow.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (projects.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Create a project first to use this template.
      </p>
    );
  }

  if (projects.length === 1) {
    return (
      <button
        onClick={() => handleUseTemplate(projects[0].id)}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Use Template"}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowProjectPicker(!showProjectPicker)}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Use Template"}
      </button>

      {showProjectPicker && (
        <div className="absolute bottom-full left-0 z-50 mb-1.5 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
            Select a project
          </div>
          <div className="max-h-40 overflow-y-auto">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleUseTemplate(project.id)}
                className="flex w-full items-center px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted"
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
