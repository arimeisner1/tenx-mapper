"use client";

import { useCallback, useRef } from "react";
import { Panel, useReactFlow, type Node, type Edge } from "@xyflow/react";
import {
  LayoutGrid,
  Maximize2,
  Undo2,
  Redo2,
  StickyNote,
  CheckCircle,
  Upload,
  Download,
  BookmarkPlus,
} from "lucide-react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLayoutedElements } from "@/lib/auto-layout";

interface CanvasToolbarProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  workflowId: string;
  workflowName: string;
  pushHistory: (nodes: Node[], edges: Edge[]) => void;
}

function ToolbarButton({
  onClick,
  disabled,
  tooltip,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-neutral-600 dark:text-neutral-300"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function Separator() {
  return (
    <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-0.5" />
  );
}

export function CanvasToolbar({
  nodes,
  edges,
  setNodes,
  setEdges,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  workflowId,
  workflowName,
  pushHistory,
}: CanvasToolbarProps) {
  const reactFlowInstance = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto Layout
  const handleAutoLayout = useCallback(() => {
    const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layouted);
    setEdges(layoutedEdges);
    pushHistory(layouted, layoutedEdges);
    window.requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    });
  }, [nodes, edges, setNodes, setEdges, pushHistory, reactFlowInstance]);

  // Zoom to Fit
  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, [reactFlowInstance]);

  // Add Sticky Note
  const handleAddStickyNote = useCallback(() => {
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const centerX = (-x + window.innerWidth / 2) / zoom;
    const centerY = (-y + window.innerHeight / 2) / zoom;

    const newNode: Node = {
      id: nanoid(),
      type: "stickyNote",
      position: { x: centerX - 90, y: centerY - 70 },
      data: { text: "", color: "yellow" },
    };

    setNodes((nds: Node[]) => {
      const updated = [...nds, newNode];
      pushHistory(updated, edges);
      return updated;
    });
  }, [reactFlowInstance, setNodes, edges, pushHistory]);

  // Validate
  const handleValidate = useCallback(() => {
    const connectedNodeIds = new Set<string>();
    for (const edge of edges) {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    }

    const nonStickyNodes = nodes.filter((n) => n.type !== "stickyNote");
    const disconnected = nonStickyNodes.filter(
      (n) => !connectedNodeIds.has(n.id)
    );

    if (disconnected.length === 0) {
      toast.success("All nodes are connected!");
    } else {
      const names = disconnected
        .map((n) => (n.data as { label?: string })?.label || n.id)
        .join(", ");
      toast.error(`${disconnected.length} disconnected node(s): ${names}`);
    }
  }, [nodes, edges]);

  // Export JSON
  const handleExportJSON = useCallback(() => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${workflowName || "workflow"}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, workflowName]);

  // Import JSON
  const handleImportJSON = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.nodes && parsed.edges) {
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
            pushHistory(parsed.nodes, parsed.edges);
            toast.success("Canvas imported successfully");
            window.requestAnimationFrame(() => {
              reactFlowInstance.fitView({ padding: 0.2 });
            });
          } else {
            toast.error("Invalid JSON: missing nodes or edges");
          }
        } catch {
          toast.error("Failed to parse JSON file");
        }
      };
      reader.readAsText(file);
      // Reset input so the same file can be re-imported
      e.target.value = "";
    },
    [setNodes, setEdges, pushHistory, reactFlowInstance]
  );

  // Save as Template
  const handleSaveAsTemplate = useCallback(async () => {
    try {
      await fetch(`/api/workflows/${workflowId}/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workflowName, nodes, edges }),
      });
      toast.success("Saved as template");
    } catch {
      toast.error("Failed to save template");
    }
  }, [workflowId, workflowName, nodes, edges]);

  return (
    <Panel position="top-center">
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center gap-0.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-full px-2 py-1 shadow-md">
          <ToolbarButton onClick={handleAutoLayout} tooltip="Auto Layout (Ctrl+Shift+L)">
            <LayoutGrid className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleFitView} tooltip="Zoom to Fit">
            <Maximize2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={onUndo} disabled={!canUndo} tooltip="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={onRedo} disabled={!canRedo} tooltip="Redo (Ctrl+Shift+Z)">
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>

          <Separator />

          <ToolbarButton onClick={handleAddStickyNote} tooltip="Add Sticky Note">
            <StickyNote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleValidate} tooltip="Validate Connections">
            <CheckCircle className="w-4 h-4" />
          </ToolbarButton>

          <Separator />

          <ToolbarButton onClick={handleImportJSON} tooltip="Import JSON">
            <Upload className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleExportJSON} tooltip="Export JSON">
            <Download className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleSaveAsTemplate} tooltip="Save as Template">
            <BookmarkPlus className="w-4 h-4" />
          </ToolbarButton>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </TooltipProvider>
    </Panel>
  );
}
