"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Puzzle } from "lucide-react";

export interface CustomNodeData {
  label: string;
  color?: string;
  subtitle?: string;
  [key: string]: unknown;
}

function CustomNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as CustomNodeData;
  const color = nodeData.color || "#8b5cf6";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Target handle — left center */}
      <Handle
        type="target"
        position={Position.Left}
        className="!rounded-full !border-2"
        style={{
          width: 12,
          height: 12,
          left: -6,
          background: color,
          borderColor: "white",
          opacity: hovered ? 1 : 0,
          transition: "all 0.2s ease",
          boxShadow: hovered ? `0 0 8px ${color}80` : "none",
        }}
      />

      {/* Main card */}
      <div
        className={cn(
          "relative overflow-hidden bg-white dark:bg-neutral-850 rounded-xl",
          selected && "ring-2 ring-blue-500"
        )}
        style={{
          width: 220,
          transition: "all 0.2s ease",
          transform: hovered
            ? "perspective(1000px) rotateX(2deg) translateY(-2px) scale(1.01)"
            : selected
            ? "scale(1.02)"
            : "none",
          boxShadow: hovered
            ? "0 4px 8px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.1), 0 24px 60px rgba(0,0,0,0.08)"
            : "0 1px 3px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.05)",
        }}
      >
        {/* Color strip — left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 rounded-l-xl"
          style={{
            width: 6,
            backgroundColor: color,
          }}
        />

        {/* Content area */}
        <div className="flex items-center gap-3 pl-4 pr-3 py-3">
          {/* Circle icon */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
            style={{
              backgroundColor: color,
              boxShadow: `0 2px 8px ${color}40`,
            }}
          >
            <Puzzle className="w-5 h-5" />
          </div>

          {/* Text */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate leading-tight">
              {nodeData.label}
            </span>
            {nodeData.subtitle && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                {nodeData.subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Source handle — right center */}
      <Handle
        type="source"
        position={Position.Right}
        className="!rounded-full !border-2"
        style={{
          width: 12,
          height: 12,
          right: -6,
          background: color,
          borderColor: "white",
          opacity: hovered ? 1 : 0,
          transition: "all 0.2s ease",
          boxShadow: hovered ? `0 0 8px ${color}80` : "none",
        }}
      />
    </div>
  );
}

export const CustomNode = memo(CustomNodeComponent);
