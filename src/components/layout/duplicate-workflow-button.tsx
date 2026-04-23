"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";

interface DuplicateWorkflowButtonProps {
  workflowId: string;
}

export function DuplicateWorkflowButton({ workflowId }: DuplicateWorkflowButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/duplicate`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
      title="Duplicate workflow"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      Duplicate
    </button>
  );
}
