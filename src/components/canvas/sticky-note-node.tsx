"use client";

import { memo, useState, useCallback, useMemo } from "react";
import { type NodeProps } from "@xyflow/react";

const ROTATIONS = [-1, -0.5, 0, 0.5, 1, 1.5, -0.8, 2];

function getRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return ROTATIONS[Math.abs(hash) % ROTATIONS.length];
}

const COLOR_MAP: Record<
  string,
  { bg: string; border: string; fold: string; shadow: string }
> = {
  yellow: {
    bg: "#fef9c3",
    border: "#fde047",
    fold: "#fbbf24",
    shadow: "rgba(251,191,36,0.2)",
  },
  blue: {
    bg: "#dbeafe",
    border: "#93c5fd",
    fold: "#60a5fa",
    shadow: "rgba(96,165,250,0.2)",
  },
  green: {
    bg: "#dcfce7",
    border: "#86efac",
    fold: "#4ade80",
    shadow: "rgba(74,222,128,0.2)",
  },
  pink: {
    bg: "#fce7f3",
    border: "#f9a8d4",
    fold: "#f472b6",
    shadow: "rgba(244,114,182,0.2)",
  },
};

function StickyNoteNodeComponent({ id, data }: NodeProps) {
  const nodeData = data as {
    text?: string;
    color?: string;
    onTextChange?: (id: string, text: string) => void;
  };
  const [text, setText] = useState(nodeData.text || "");
  const rotation = useMemo(() => getRotation(id), [id]);
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
      className="relative"
      style={{
        width: 200,
        height: 160,
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Main note body */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 4,
          padding: 14,
          paddingBottom: 24,
          boxShadow: `2px 3px 8px rgba(0,0,0,0.1), 1px 1px 3px rgba(0,0,0,0.06)`,
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 23px, rgba(0,0,0,0.03) 23px, rgba(0,0,0,0.03) 24px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Type a note..."
          className="w-full h-full border-none outline-none resize-none text-sm leading-relaxed"
          style={{
            background: "transparent",
            color: "#44403c",
            lineHeight: "24px",
          }}
        />

        {/* Folded corner effect */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 20,
            height: 20,
            background: `linear-gradient(135deg, ${colors.bg} 50%, ${colors.fold} 50%)`,
            boxShadow: `-1px -1px 2px rgba(0,0,0,0.05)`,
          }}
        />
      </div>
    </div>
  );
}

export const StickyNoteNode = memo(StickyNoteNodeComponent);
