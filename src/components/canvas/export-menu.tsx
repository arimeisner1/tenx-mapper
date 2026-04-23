"use client";

import { useState, useRef, useEffect } from "react";
import { exportToPng, exportToPdf } from "@/lib/export";
import toast from "react-hot-toast";

interface ExportMenuProps {
  workflowName: string;
  workflowId: string;
  shareToken: string | null;
  nodeMetadata: {
    name: string;
    description?: string | null;
    status?: string;
    costEstimate?: string | null;
    links?: unknown;
  }[];
}

export function ExportMenu({
  workflowName,
  workflowId,
  shareToken,
  nodeMetadata,
}: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const canvasElementId = "react-flow-canvas";

  const handleExportPng = () => {
    setOpen(false);
    exportToPng(canvasElementId, workflowName);
  };

  const handleExportPdf = () => {
    setOpen(false);
    exportToPdf(canvasElementId, workflowName, nodeMetadata);
  };

  const handleCopyShareLink = async () => {
    setOpen(false);
    if (!shareToken) {
      toast.error("No share link available for this workflow.");
      return;
    }
    const shareUrl = `${window.location.origin}/share/${shareToken}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        Export
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="py-1">
            <button
              onClick={handleExportPng}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-card-foreground transition-colors hover:bg-muted"
            >
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
              Export as PNG
            </button>

            <button
              onClick={handleExportPdf}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-card-foreground transition-colors hover:bg-muted"
            >
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              Export as PDF
            </button>

            <div className="mx-3 my-1 border-t border-border" />

            <button
              onClick={handleCopyShareLink}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-card-foreground transition-colors hover:bg-muted"
            >
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.342"
                />
              </svg>
              Copy Share Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
