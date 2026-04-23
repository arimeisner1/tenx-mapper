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
  markerEnd,
  data,
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
  });

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

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
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
              className="px-2 py-0.5 text-xs rounded border border-blue-400 bg-white dark:bg-neutral-800 dark:text-neutral-100 outline-none shadow-md min-w-[60px] text-center"
              style={{ fontSize: 11 }}
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-0.5 text-xs rounded bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 shadow-sm cursor-text transition-colors min-h-[20px] min-w-[24px]"
              style={{ fontSize: 11 }}
              title="Click to edit label"
            >
              {labelText || "\u00B7\u00B7\u00B7"}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
