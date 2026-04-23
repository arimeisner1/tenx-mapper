"use client";

import { memo } from "react";
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

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full"
      />
      <div
        className={cn(
          "min-w-[180px] bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 transition-shadow",
          selected && "ring-2 ring-blue-500 shadow-lg"
        )}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            <Puzzle className="w-4 h-4" />
          </div>
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
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full"
      />
    </>
  );
}

export const CustomNode = memo(CustomNodeComponent);
