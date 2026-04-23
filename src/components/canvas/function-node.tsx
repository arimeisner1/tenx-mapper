"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export interface FunctionNodeData {
  label: string;
  [key: string]: unknown;
}

function FunctionNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FunctionNodeData;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Target handle — left */}
      <Handle
        type="target"
        position={Position.Left}
        className="!rounded-full !border-2"
        style={{
          width: 8,
          height: 8,
          left: -4,
          background: "#f59e0b",
          borderColor: "white",
          opacity: hovered ? 1 : 0,
          transition: "all 0.2s ease",
          boxShadow: hovered ? "0 0 6px rgba(245,158,11,0.5)" : "none",
        }}
      />

      {/* Pill card */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700",
          selected && "ring-2 ring-blue-500"
        )}
        style={{
          borderRadius: 999,
          transition: "all 0.2s ease",
          transform: hovered ? "translateY(-1px)" : "none",
          boxShadow: hovered
            ? "0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)"
            : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
          <Zap className="w-3 h-3 text-amber-500" />
        </div>
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 truncate max-w-[120px]">
          {nodeData.label}
        </span>
      </div>

      {/* Source handle — right */}
      <Handle
        type="source"
        position={Position.Right}
        className="!rounded-full !border-2"
        style={{
          width: 8,
          height: 8,
          right: -4,
          background: "#f59e0b",
          borderColor: "white",
          opacity: hovered ? 1 : 0,
          transition: "all 0.2s ease",
          boxShadow: hovered ? "0 0 6px rgba(245,158,11,0.5)" : "none",
        }}
      />
    </div>
  );
}

export const FunctionNode = memo(FunctionNodeComponent);
