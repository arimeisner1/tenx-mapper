"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export interface FunctionNodeData {
  label: string;
  [key: string]: unknown;
}

function FunctionNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as FunctionNodeData;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full"
      />
      <div
        className={cn(
          "min-w-[140px] bg-white dark:bg-neutral-800 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700 transition-shadow",
          selected && "ring-2 ring-blue-500 shadow-md"
        )}
      >
        <div className="flex items-center gap-2 px-2.5 py-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
            {nodeData.label}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full"
      />
    </>
  );
}

export const FunctionNode = memo(FunctionNodeComponent);
