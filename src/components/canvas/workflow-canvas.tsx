"use client";

import {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
  type DragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ArrowLeft,
  Share2,
  Download,
  Check,
  Loader2,
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Plus,
  Layers,
  Puzzle,
  BookmarkPlus,
  MousePointerClick,
} from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { SoftwareNode } from "./software-node";
import { CustomNode } from "./custom-node";
import { FunctionNode } from "./function-node";
import { GroupNode } from "./group-node";
import { StickyNoteNode } from "./sticky-note-node";
import { EditableEdge } from "./editable-edge";
import { SoftwareLibrary } from "./software-library";
import { DetailPanel } from "./detail-panel";
import { AiPanel } from "./ai-panel";
import { CanvasToolbar } from "./canvas-toolbar";
import { WorkflowStats } from "./workflow-stats";
import { ShortcutsDialog } from "@/components/layout/shortcuts-dialog";
import { getLayoutedElements } from "@/lib/auto-layout";
import { cn } from "@/lib/utils";

interface NodeMetadataEntry {
  [key: string]: unknown;
  id?: string;
  nodeId: string;
  name: string;
  description?: string | null;
  notes?: string | null;
  links?: unknown;
  costEstimate?: string | null;
  apiEndpoint?: string | null;
  status?: string;
  customFields?: unknown;
}

interface CatalogEntry {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string;
  description: string | null;
  defaultColor: string;
}

interface WorkflowData {
  id: string;
  name: string;
  description?: string | null;
  canvasData: Record<string, unknown>;
  projectId: string;
  projectName: string;
  nodeMetadata: NodeMetadataEntry[];
}

interface WorkflowCanvasProps {
  workflow: WorkflowData;
  catalog: CatalogEntry[];
}

const COLOR_OPTIONS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

const nodeTypes: NodeTypes = {
  softwareNode: SoftwareNode,
  customNode: CustomNode,
  functionNode: FunctionNode,
  groupNode: GroupNode,
  stickyNote: StickyNoteNode,
};

const edgeTypes: EdgeTypes = {
  editableEdge: EditableEdge,
};

function WorkflowCanvasInner({ workflow, catalog }: WorkflowCanvasProps) {
  const reactFlowInstance = useReactFlow();

  const initialNodes = useMemo(
    () => (workflow.canvasData?.nodes as Node[]) || [],
    []
  );
  const initialEdges = useMemo(
    () => (workflow.canvasData?.edges as Edge[]) || [],
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [workflowName, setWorkflowName] = useState(workflow.name);
  const [editingName, setEditingName] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [showInlineCustom, setShowInlineCustom] = useState(false);
  const [inlineCustomName, setInlineCustomName] = useState("");
  const [inlineCustomColor, setInlineCustomColor] = useState("#8b5cf6");
  const [metadataMap, setMetadataMap] = useState<Record<string, NodeMetadataEntry>>(() => {
    const map: Record<string, NodeMetadataEntry> = {};
    for (const m of workflow.nodeMetadata) {
      map[m.nodeId] = m;
    }
    return map;
  });

  // Undo history
  const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const historyIndexRef = useRef(-1);

  const pushHistory = useCallback((n: Node[], e: Edge[]) => {
    const history = historyRef.current;
    const idx = historyIndexRef.current;
    // Trim future history if we branched
    historyRef.current = history.slice(0, idx + 1);
    historyRef.current.push({ nodes: JSON.parse(JSON.stringify(n)), edges: JSON.parse(JSON.stringify(e)) });
    if (historyRef.current.length > 50) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  // Push initial state
  useEffect(() => {
    pushHistory(initialNodes, initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-save debounce
  const saveCanvas = useCallback(
    (updatedNodes: Node[], updatedEdges: Edge[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        setSaveStatus("saving");
        try {
          await fetch(`/api/workflows/${workflow.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              canvasData: { nodes: updatedNodes, edges: updatedEdges },
            }),
          });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("idle");
        }
      }, 500);
    },
    [workflow.id]
  );

  // Trigger save on nodes/edges change
  useEffect(() => {
    saveCanvas(nodes, edges);
  }, [nodes, edges, saveCanvas]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...connection,
            type: "editableEdge",
            data: { label: "" },
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          },
          eds
        );
        pushHistory(nodes, newEdges);
        return newEdges;
      });
    },
    [setEdges, nodes, pushHistory]
  );

  // Drag and drop from library
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/tenx-node");
      if (!raw) return;

      const data = JSON.parse(raw);
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode: Node = {
        id: nanoid(),
        type: data.type || "softwareNode",
        position,
        data: {
          label: data.label,
          logoUrl: data.logoUrl,
          category: data.category,
          color: data.color,
          subtitle: data.subtitle,
        },
      };

      if (data.type === "groupNode") {
        newNode.style = { width: 300, height: 200 };
      }

      setNodes((nds) => {
        const updated = [...nds, newNode];
        pushHistory(updated, edges);
        return updated;
      });
    },
    [reactFlowInstance, setNodes, edges, pushHistory]
  );

  // Node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setExportOpen(false);
    setQuickAddOpen(false);
    setShowInlineCustom(false);
  }, []);

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const updated = nds.filter((n) => n.id !== nodeId);
        setEdges((eds) => {
          const updatedEdges = eds.filter((e) => e.source !== nodeId && e.target !== nodeId);
          pushHistory(updated, updatedEdges);
          return updatedEdges;
        });
        return updated;
      });
      setSelectedNodeId(null);

      // Delete metadata from server
      fetch(`/api/workflows/${workflow.id}/metadata`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId }),
      }).catch(() => {});
    },
    [setNodes, setEdges, workflow.id, pushHistory]
  );

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx > 0) {
      historyIndexRef.current = idx - 1;
      const prev = historyRef.current[idx - 1];
      setNodes(prev.nodes);
      setEdges(prev.edges);
    }
  }, [setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx < historyRef.current.length - 1) {
      historyIndexRef.current = idx + 1;
      const next = historyRef.current[idx + 1];
      setNodes(next.nodes);
      setEdges(next.edges);
    }
  }, [setNodes, setEdges]);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // Auto-layout handler
  const handleAutoLayout = useCallback(() => {
    const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes(layouted);
    setEdges(layoutedEdges);
    pushHistory(layouted, layoutedEdges);
    window.requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    });
  }, [nodes, edges, setNodes, setEdges, pushHistory, reactFlowInstance]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't capture if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Delete / Backspace to remove selected nodes/edges
      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedNodes = nodes.filter((n) => n.selected);
        const selectedEdges = edges.filter((edge) => edge.selected);
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          e.preventDefault();
          const nodeIdsToRemove = new Set(selectedNodes.map((n) => n.id));
          const edgeIdsToRemove = new Set(selectedEdges.map((edge) => edge.id));
          setNodes((nds) => {
            const updated = nds.filter((n) => !nodeIdsToRemove.has(n.id));
            setEdges((eds) => {
              const updatedEdges = eds.filter(
                (edge) =>
                  !edgeIdsToRemove.has(edge.id) &&
                  !nodeIdsToRemove.has(edge.source) &&
                  !nodeIdsToRemove.has(edge.target)
              );
              pushHistory(updated, updatedEdges);
              return updatedEdges;
            });
            return updated;
          });
          setSelectedNodeId(null);
          // Delete metadata for removed nodes
          for (const nodeId of nodeIdsToRemove) {
            fetch(`/api/workflows/${workflow.id}/metadata`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nodeId }),
            }).catch(() => {});
          }
        } else if (selectedNodeId) {
          e.preventDefault();
          handleDeleteNode(selectedNodeId);
        }
      }

      // Ctrl+Z / Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y for redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        handleRedo();
      }

      // Ctrl+A / Cmd+A to select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
        setEdges((eds) => eds.map((edge) => ({ ...edge, selected: true })));
      }

      // Ctrl+Shift+L / Cmd+Shift+L for auto-layout
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        handleAutoLayout();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, handleDeleteNode, handleUndo, handleRedo, handleAutoLayout, setNodes, setEdges, nodes, edges, pushHistory, workflow.id]);

  // Metadata update
  const handleMetadataUpdate = useCallback((updated: NodeMetadataEntry) => {
    setMetadataMap((prev) => ({ ...prev, [updated.nodeId]: updated }));
  }, []);

  // Save name
  const saveName = useCallback(async () => {
    setEditingName(false);
    if (workflowName.trim() && workflowName !== workflow.name) {
      await fetch(`/api/workflows/${workflow.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workflowName.trim() }),
      });
    }
  }, [workflowName, workflow.id, workflow.name]);

  // Export handlers
  const handleExportPNG = useCallback(async () => {
    setExportOpen(false);
    try {
      const { toPng } = await import("html-to-image");
      const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;
      if (!viewport) return;
      const dataUrl = await toPng(viewport, { backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `${workflowName || "workflow"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silently fail
    }
  }, [workflowName]);

  const handleExportPDF = useCallback(async () => {
    setExportOpen(false);
    try {
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");
      const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;
      if (!viewport) return;
      const dataUrl = await toPng(viewport, { backgroundColor: "#ffffff" });
      const pdf = new jsPDF("landscape");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${workflowName || "workflow"}.pdf`);
    } catch {
      // silently fail
    }
  }, [workflowName]);

  // Copy share link
  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/share/${workflow.id}`;
    navigator.clipboard.writeText(url);
  }, [workflow.id]);

  // Save as template
  const handleSaveAsTemplate = useCallback(async () => {
    try {
      await fetch("/api/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: workflow.id,
          name: workflowName,
        }),
      });
    } catch {
      // silently fail
    }
  }, [workflow.id, workflowName]);

  // Quick-add: Add custom node at viewport center
  const addCustomNodeAtCenter = useCallback(() => {
    if (!inlineCustomName.trim()) return;
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const centerX = (-x + window.innerWidth / 2) / zoom;
    const centerY = (-y + window.innerHeight / 2) / zoom;

    const newNode: Node = {
      id: nanoid(),
      type: "customNode",
      position: { x: centerX - 90, y: centerY - 25 },
      data: {
        label: inlineCustomName.trim(),
        color: inlineCustomColor,
        subtitle: "Custom",
      },
    };

    setNodes((nds) => {
      const updated = [...nds, newNode];
      pushHistory(updated, edges);
      return updated;
    });
    setShowInlineCustom(false);
    setInlineCustomName("");
    setQuickAddOpen(false);
  }, [inlineCustomName, inlineCustomColor, reactFlowInstance, setNodes, edges, pushHistory]);

  // Quick-add: Add group node at viewport center
  const addGroupAtCenter = useCallback(() => {
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const centerX = (-x + window.innerWidth / 2) / zoom;
    const centerY = (-y + window.innerHeight / 2) / zoom;

    const newNode: Node = {
      id: nanoid(),
      type: "groupNode",
      position: { x: centerX - 150, y: centerY - 100 },
      data: { label: "New Group", color: "#6366f1" },
      style: { width: 300, height: 200 },
    };

    setNodes((nds) => {
      const updated = [...nds, newNode];
      pushHistory(updated, edges);
      return updated;
    });
    setQuickAddOpen(false);
  }, [reactFlowInstance, setNodes, edges, pushHistory]);

  // Edge label update
  const handleEdgeLabelUpdate = useCallback(
    (edgeId: string, label: string) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId ? { ...e, data: { ...e.data, label } } : e
        )
      );
    },
    [setEdges]
  );

  // Derive selected node data
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedMetadata = selectedNodeId ? metadataMap[selectedNodeId] || null : null;

  // Compute connection counts per node and canvas labels for the info panel
  const edgeCountMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const e of edges) {
      if (!map[e.source]) map[e.source] = [];
      if (!map[e.target]) map[e.target] = [];
      if (!map[e.source].includes(e.target)) map[e.source].push(e.target);
      if (!map[e.target].includes(e.source)) map[e.target].push(e.source);
    }
    return map;
  }, [edges]);

  const canvasNodeLabels = useMemo(
    () => nodes.map((n) => (n.data as { label?: string })?.label || "").filter(Boolean),
    [nodes]
  );

  const selectedConnectedNodeIds = useMemo(
    () => (selectedNodeId ? edgeCountMap[selectedNodeId] || [] : []),
    [selectedNodeId, edgeCountMap]
  );

  // Inject connectionCount into software nodes
  const nodesWithConnectionCount = useMemo(() => {
    return nodes.map((n) => {
      if (n.type === "softwareNode") {
        const count = edgeCountMap[n.id]?.length || 0;
        const currentCount = (n.data as Record<string, unknown>).connectionCount;
        if (currentCount !== count) {
          return { ...n, data: { ...n.data, connectionCount: count } };
        }
      }
      return n;
    });
  }, [nodes, edgeCountMap]);

  const hasNodes = nodes.length > 0;

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Top Bar */}
      <div className="h-12 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 flex items-center px-3 gap-2 shrink-0 z-20">
        <a
          href={`/project/${workflow.projectId}`}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Back to project"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </a>

        <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700" />

        {editingName ? (
          <input
            ref={nameInputRef}
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName();
              if (e.key === "Escape") {
                setWorkflowName(workflow.name);
                setEditingName(false);
              }
            }}
            className="text-sm font-medium bg-transparent border-b border-blue-500 outline-none px-1 text-neutral-900 dark:text-neutral-100"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-1"
          >
            {workflowName}
          </button>
        )}

        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          in {workflow.projectName}
        </span>

        <div className="flex-1" />

        {/* Save status */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mr-2">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              Saved
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={handleSaveAsTemplate}
          title="Save current workflow as a reusable template"
        >
          <BookmarkPlus className="w-3.5 h-3.5 mr-1.5" />
          Save as Template
        </Button>

        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleShare}>
          <Share2 className="w-3.5 h-3.5 mr-1.5" />
          Share
        </Button>

        {/* Export dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setExportOpen(!exportOpen)}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-1 min-w-[140px] z-50">
              <button
                onClick={handleExportPNG}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <ImageIcon className="w-4 h-4" />
                Export PNG
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-violet-500" />
          AI
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        {/* Library sidebar */}
        <SoftwareLibrary
          catalog={catalog}
          collapsed={libraryCollapsed}
          onToggle={() => setLibraryCollapsed(!libraryCollapsed)}
        />

        {/* React Flow canvas */}
        <ReactFlow
          nodes={nodesWithConnectionCount}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid
          snapGrid={[16, 16]}
          defaultEdgeOptions={{
            type: "editableEdge",
            data: { label: "" },
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          }}
          fitView
          className="bg-neutral-50 dark:bg-neutral-950"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
            color="#d4d4d8"
            className="dark:!bg-neutral-950"
          />
          <Controls
            position="bottom-left"
            className="!bg-white dark:!bg-neutral-800 !border-neutral-200 dark:!border-neutral-700 !rounded-lg !shadow-md [&>button]:!bg-white dark:[&>button]:!bg-neutral-800 [&>button]:!border-neutral-200 dark:[&>button]:!border-neutral-700 [&>button]:!text-neutral-600 dark:[&>button]:!text-neutral-400"
            style={{ marginLeft: libraryCollapsed ? 16 : 296 }}
          />
          <MiniMap
            position="bottom-right"
            className="!bg-white dark:!bg-neutral-800 !border-neutral-200 dark:!border-neutral-700 !rounded-lg !shadow-md"
            nodeColor={(node) => {
              const data = node.data as { color?: string } | undefined;
              return data?.color || "#6366f1";
            }}
            maskColor="rgba(0, 0, 0, 0.08)"
            style={{ marginRight: selectedNodeId || aiPanelOpen ? 436 : 16 }}
          />

          <CanvasToolbar
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            workflowId={workflow.id}
            workflowName={workflowName}
            pushHistory={pushHistory}
          />

          {/* Empty state overlay */}
          {!hasNodes && (
            <Panel position="top-center" className="!top-1/3">
              <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <MousePointerClick className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Start building your workflow
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Drag tools from the library or click <strong>+</strong> to start building your workflow
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      if (libraryCollapsed) setLibraryCollapsed(false);
                    }}
                  >
                    <Layers className="w-3.5 h-3.5 mr-1.5" />
                    Open Library
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => setQuickAddOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Quick Add
                  </Button>
                </div>
              </div>
            </Panel>
          )}

          {/* Floating quick-add button - bottom center */}
          <Panel position="bottom-center" className="!mb-6">
            <div className="relative">
              {/* Inline custom node form */}
              {showInlineCustom && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-4 min-w-[260px] z-50">
                  <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                    Add Custom Node
                  </h4>
                  <input
                    value={inlineCustomName}
                    onChange={(e) => setInlineCustomName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addCustomNodeAtCenter();
                      if (e.key === "Escape") {
                        setShowInlineCustom(false);
                        setInlineCustomName("");
                      }
                    }}
                    placeholder="Node name..."
                    className="w-full h-8 rounded-md border border-neutral-300 dark:border-neutral-600 bg-transparent px-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:text-neutral-100 mb-3"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5 mb-3">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setInlineCustomColor(c)}
                        className={cn(
                          "w-6 h-6 rounded-full transition-transform",
                          inlineCustomColor === c && "ring-2 ring-offset-1 ring-neutral-400 scale-110"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      disabled={!inlineCustomName.trim()}
                      onClick={addCustomNodeAtCenter}
                    >
                      Add Node
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setShowInlineCustom(false);
                        setInlineCustomName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Quick-add menu */}
              {quickAddOpen && !showInlineCustom && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl py-2 min-w-[200px] z-50">
                  <button
                    onClick={() => {
                      setQuickAddOpen(false);
                      if (libraryCollapsed) setLibraryCollapsed(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-blue-500" />
                    Add Software Tool
                  </button>
                  <button
                    onClick={() => setShowInlineCustom(true)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Puzzle className="w-4 h-4 text-violet-500" />
                    Add Custom Node
                  </button>
                  <button
                    onClick={addGroupAtCenter}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-emerald-500" />
                    Add Group
                  </button>
                </div>
              )}

              <Button
                onClick={() => {
                  setQuickAddOpen(!quickAddOpen);
                  setShowInlineCustom(false);
                }}
                className="rounded-full w-12 h-12 shadow-lg"
                size="icon"
              >
                <Plus className={cn("w-6 h-6 transition-transform", quickAddOpen && "rotate-45")} />
              </Button>
            </div>
          </Panel>
        </ReactFlow>

        {/* Detail panel */}
        <DetailPanel
          workflowId={workflow.id}
          selectedNodeId={selectedNodeId}
          selectedNodeLabel={
            (selectedNode?.data as { label?: string })?.label ||
            selectedNode?.id ||
            ""
          }
          metadata={selectedMetadata}
          onClose={() => setSelectedNodeId(null)}
          onDeleteNode={handleDeleteNode}
          onMetadataUpdate={handleMetadataUpdate as never}
          canvasNodeLabels={canvasNodeLabels}
          connectedNodeIds={selectedConnectedNodeIds}
        />

        {/* AI panel */}
        <AiPanel
          workflowId={workflow.id}
          isOpen={aiPanelOpen}
          onClose={() => setAiPanelOpen(false)}
        />

        {/* Workflow stats */}
        <WorkflowStats
          nodes={nodes}
          edges={edges}
          metadataMap={metadataMap}
        />

        {/* Keyboard shortcuts dialog */}
        <ShortcutsDialog />
      </div>
    </div>
  );
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
