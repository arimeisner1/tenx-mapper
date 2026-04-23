"use client";

import { memo, type CSSProperties } from "react";
import {
  Handle,
  Position,
  NodeResizer,
  type NodeProps,
} from "@xyflow/react";
import { cn } from "@/lib/utils";

export interface GroupNodeData {
  label: string;
  color?: string;
  [key: string]: unknown;
}

function GroupNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as GroupNodeData;
  const color = nodeData.color || "#6366f1";

  const bgStyle: CSSProperties = {
    backgroundColor: `${color}10`,
    borderColor: `${color}40`,
  };

  return (
    <>
      <NodeResizer
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        lineClassName="!border-blue-500"
        handleClassName="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white !rounded-sm"
      />
      <div
        className={cn(
          "w-full h-full rounded-xl border-2 border-dashed",
          selected && "ring-1 ring-blue-500"
        )}
        style={bgStyle}
      >
        <div
          className="px-3 py-1.5 text-xs font-semibold rounded-tl-[10px] rounded-br-lg inline-block"
          style={{ backgroundColor: color, color: "white" }}
        >
          {nodeData.label}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full !opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-800 !rounded-full !opacity-0"
      />
    </>
  );
}

export const GroupNode = memo(GroupNodeComponent);
