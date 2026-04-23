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

  const containerStyle: CSSProperties = {
    backgroundColor: `${color}1a`,
    borderColor: `${color}50`,
    boxShadow: selected
      ? `inset 0 2px 12px ${color}15, 0 0 0 2px ${color}40`
      : `inset 0 2px 8px ${color}0a`,
  };

  return (
    <>
      <NodeResizer
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        lineClassName="!border-blue-500"
        handleClassName="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !rounded-sm"
      />
      <div
        className={cn(
          "w-full h-full border-2 border-dashed transition-shadow",
          selected && "ring-1 ring-blue-500/50"
        )}
        style={{
          ...containerStyle,
          borderRadius: 12,
          transition: "all 0.2s ease",
        }}
      >
        {/* Title bar */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white"
          style={{
            backgroundColor: color,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            boxShadow: `0 2px 6px ${color}40`,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 16 16"
            fill="none"
            className="opacity-80"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          {nodeData.label}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!rounded-full !border-2"
        style={{
          width: 12,
          height: 12,
          background: color,
          borderColor: "white",
          opacity: 0,
          transition: "all 0.2s ease",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!rounded-full !border-2"
        style={{
          width: 12,
          height: 12,
          background: color,
          borderColor: "white",
          opacity: 0,
          transition: "all 0.2s ease",
        }}
      />
    </>
  );
}

export const GroupNode = memo(GroupNodeComponent);
