"use client";

import { memo, useState, useCallback } from "react";
import { type NodeProps } from "@xyflow/react";

const ROTATIONS = [-1, -0.5, 0, 0.5, 1];

function getRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return ROTATIONS[Math.abs(hash) % ROTATIONS.length];
}

const COLOR_MAP: Record<string, { bg: string; border: string }> = {
  yellow: { bg: "bg-amber-100 dark:bg-amber-200", border: "border-amber-300" },
  blue: { bg: "bg-blue-100 dark:bg-blue-200", border: "border-blue-300" },
  green: { bg: "bg-green-100 dark:bg-green-200", border: "border-green-300" },
  pink: { bg: "bg-pink-100 dark:bg-pink-200", border: "border-pink-300" },
};

function StickyNoteNodeComponent({ id, data }: NodeProps) {
  const nodeData = data as { text?: string; color?: string; onTextChange?: (id: string, text: string) => void };
  const [text, setText] = useState(nodeData.text || "");
  const rotation = getRotation(id);
  const colorKey = nodeData.color || "yellow";
  const colors = COLOR_MAP[colorKey] || COLOR_MAP.yellow;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      nodeData.onTextChange?.(id, e.target.value);
    },
    [id, nodeData]
  );

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-sm shadow-md min-w-[160px] min-h-[120px] p-3`}
      style={{
        transform: `rotate(${rotation}deg)`,
        resize: "both",
        overflow: "auto",
        width: 180,
        height: 140,
      }}
    >
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type a note..."
        className="w-full h-full bg-transparent border-none outline-none resize-none text-sm text-neutral-800 placeholder-neutral-400"
        style={{ minHeight: 80 }}
      />
    </div>
  );
}

export const StickyNoteNode = memo(StickyNoteNodeComponent);
