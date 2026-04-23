"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";

export function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [labelText, setLabelText] = useState(
    (data as { label?: string })?.label || ""
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  // Sync label from data when it changes externally
  useEffect(() => {
    setLabelText((data as { label?: string })?.label || "");
  }, [(data as { label?: string })?.label]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const saveLabel = useCallback(() => {
    setEditing(false);
    setEdges((eds) =>
      eds.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, label: labelText } } : e
      )
    );
  }, [id, labelText, setEdges]);

  const markerEnd = selected ? "url(#arrow-selected)" : "url(#arrow)";
  const strokeColor = selected ? "#3b82f6" : "#94a3b8";
  const strokeWidth = selected ? 3 : 2;

  const displayLabel = (data as { label?: string })?.label || labelText;

  return (
    <>
      {/* Invisible wider path for easier clicking */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: "pointer" }}
      />

      {/* Visible edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
        markerEnd={markerEnd}
      />

      {/* Animated dots flowing along the path */}
      <circle r="3" fill="#3b82f6" opacity="0.6">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      <circle r="3" fill="#3b82f6" opacity="0.4">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
          begin="1s"
        />
      </circle>
      <circle r="3" fill="#3b82f6" opacity="0.2">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
          begin="2s"
        />
      </circle>

      {/* Label — only show when there is actual text */}
      {displayLabel ? (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            {editing ? (
              <input
                ref={inputRef}
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={saveLabel}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveLabel();
                  if (e.key === "Escape") {
                    setLabelText((data as { label?: string })?.label || "");
                    setEditing(false);
                  }
                }}
                className="px-2 py-0.5 text-[10px] rounded-full border border-blue-400 bg-white dark:bg-neutral-800 dark:text-neutral-100 outline-none shadow-md min-w-[60px] text-center font-medium"
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-2 py-0.5 text-[10px] rounded-full bg-white dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 shadow-sm cursor-pointer transition-colors font-medium"
                title="Click to edit label"
              >
                {displayLabel}
              </button>
            )}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
