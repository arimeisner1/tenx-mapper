"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export interface SoftwareNodeData {
  label: string;
  logoUrl?: string;
  category?: string;
  color?: string;
  subtitle?: string;
  connectionCount?: number;
  [key: string]: unknown;
}

function SoftwareNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as SoftwareNodeData;
  const borderColor = nodeData.color || "#6366f1";
  const connectionCount = nodeData.connectionCount ?? 0;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full"
      />
      <div
        className={cn(
          "relative min-w-[180px] bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 transition-shadow",
          selected && "ring-2 ring-blue-500 shadow-lg"
        )}
        style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          {nodeData.logoUrl ? (
            <img
              src={nodeData.logoUrl}
              alt={nodeData.label}
              className="w-8 h-8 rounded-md object-contain bg-neutral-50 dark:bg-neutral-700 p-0.5"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: borderColor }}
            >
              {nodeData.label?.charAt(0)?.toUpperCase() || "S"}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {nodeData.label}
            </span>
            {nodeData.subtitle && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {nodeData.subtitle}
              </span>
            )}
          </div>
        </div>
        {connectionCount > 0 && (
          <div
            className="absolute -bottom-1.5 -right-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1 shadow-sm"
            style={{ backgroundColor: borderColor }}
            title={`${connectionCount} connection${connectionCount !== 1 ? "s" : ""}`}
          >
            {connectionCount}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full"
      />
    </>
  );
}

export const SoftwareNode = memo(SoftwareNodeComponent);
