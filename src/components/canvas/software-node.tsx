"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export interface SoftwareNodeData {
  label: string;
  logoUrl?: string;
  category?: string;
  color?: string;
  subtitle?: string;
  connectionCount?: number;
  status?: "active" | "planned" | "deprecated";
  [key: string]: unknown;
}

const STATUS_COLORS: Record<string, string> = {
  active: "#22c55e",
  planned: "#eab308",
  deprecated: "#9ca3af",
};

function SoftwareNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as SoftwareNodeData;
  const categoryColor = nodeData.color || "#6366f1";
  const connectionCount = nodeData.connectionCount ?? 0;
  const status = nodeData.status || "active";
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
        style={{
          background: categoryColor,
          boxShadow: hovered ? `0 0 8px ${categoryColor}80` : "none",
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
            backgroundColor: categoryColor,
          }}
        />

        {/* Content area */}
        <div className="flex items-center gap-3 pl-4 pr-3 py-3">
          {/* Logo / fallback */}
          {nodeData.logoUrl ? (
            <img
              src={nodeData.logoUrl}
              alt={nodeData.label}
              className="w-10 h-10 rounded-lg object-contain bg-neutral-50 dark:bg-neutral-700 p-1 shrink-0"
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-base font-bold shrink-0"
              style={{
                backgroundColor: categoryColor,
                boxShadow: `0 2px 8px ${categoryColor}40`,
              }}
            >
              {nodeData.label?.charAt(0)?.toUpperCase() || "S"}
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate leading-tight">
              {nodeData.label}
            </span>
            {(nodeData.subtitle || nodeData.category) && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                {nodeData.subtitle || nodeData.category}
              </span>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between px-4 pb-2.5 pt-0">
          {/* Connection count pill */}
          {connectionCount > 0 && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: `${categoryColor}cc` }}
            >
              {connectionCount} {connectionCount === 1 ? "conn" : "conns"}
            </span>
          )}
          {connectionCount === 0 && <span />}

          {/* Status dot */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status] }}
              title={status}
            />
            <span className="text-[10px] text-neutral-400 capitalize">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Source handle — right center */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: categoryColor,
          boxShadow: hovered ? `0 0 8px ${categoryColor}80` : "none",
        }}
      />
    </div>
  );
}

export const SoftwareNode = memo(SoftwareNodeComponent);
