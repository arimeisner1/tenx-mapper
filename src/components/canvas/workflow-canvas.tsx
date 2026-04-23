"use client";

import {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
  type DragEvent,
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
} from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { SoftwareNode } from "./software-node";
import { CustomNode } from "./custom-node";
import { FunctionNode } from "./function-node";
import { GroupNode } from "./group-node";
import { SoftwareLibrary } from "./software-library";
import { DetailPanel } from "./detail-panel";
import { AiPanel } from "./ai-panel";

interface NodeMetadataEntry {
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

const nodeTypes: NodeTypes = {
  softwareNode: SoftwareNode,
  customNode: CustomNode,
  functionNode: FunctionNode,
  groupNode: GroupNode,
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
  const [metadataMap, setMetadataMap] = useState<Record<string, NodeMetadataEntry>>(() => {
    const map: Record<string, NodeMetadataEntry> = {};
    for (const m of workflow.nodeMetadata) {
      map[m.nodeId] = m;
    }
    return map;
  });

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
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            style: { stroke: "#94a3b8", strokeWidth: 2 },
            type: "smoothstep",
          },
          eds
        )
      );
    },
    [setEdges]
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

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  // Node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setExportOpen(false);
  }, []);

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      setSelectedNodeId(null);

      // Delete metadata from server
      fetch(`/api/workflows/${workflow.id}/metadata`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId }),
      }).catch(() => {});
    },
    [setNodes, setEdges, workflow.id]
  );

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

  // Derive selected node data
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedMetadata = selectedNodeId ? metadataMap[selectedNodeId] || null : null;

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
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          snapToGrid
          snapGrid={[16, 16]}
          defaultEdgeOptions={{
            style: { stroke: "#94a3b8", strokeWidth: 2 },
            type: "smoothstep",
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
          onMetadataUpdate={handleMetadataUpdate}
        />

        {/* AI panel */}
        <AiPanel
          workflowId={workflow.id}
          isOpen={aiPanelOpen}
          onClose={() => setAiPanelOpen(false)}
        />
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
