"use client";

import { useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";

interface MetadataEntry {
  costEstimate?: string | null;
}

interface WorkflowStatsProps {
  nodes: Node[];
  edges: Edge[];
  metadataMap: Record<string, MetadataEntry & Record<string, unknown>>;
}

export function WorkflowStats({ nodes, edges, metadataMap }: WorkflowStatsProps) {
  const stats = useMemo(() => {
    const categories = new Set<string>();
    let totalCost = 0;

    for (const node of nodes) {
      const data = node.data as { category?: string } | undefined;
      if (data?.category) {
        categories.add(data.category);
      }

      const meta = metadataMap[node.id];
      if (meta?.costEstimate) {
        const parsed = parseFloat(meta.costEstimate.replace(/[^0-9.]/g, ""));
        if (!isNaN(parsed)) {
          totalCost += parsed;
        }
      }
    }

    return {
      nodeCount: nodes.length,
      connectionCount: edges.length,
      categories: Array.from(categories),
      totalCost,
    };
  }, [nodes, edges, metadataMap]);

  if (stats.nodeCount === 0) return null;

  return (
    <div className="absolute bottom-20 left-4 z-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm px-3 py-2 text-xs space-y-1 min-w-[160px]">
      <div className="font-semibold text-neutral-700 dark:text-neutral-300 text-[11px] uppercase tracking-wide mb-1">
        Workflow Stats
      </div>
      <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
        <span>Nodes</span>
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{stats.nodeCount}</span>
      </div>
      <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
        <span>Connections</span>
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{stats.connectionCount}</span>
      </div>
      {stats.categories.length > 0 && (
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Categories</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{stats.categories.length}</span>
        </div>
      )}
      {stats.totalCost > 0 && (
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Est. Cost</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            ${stats.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  );
}
