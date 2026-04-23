"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeTypes,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SoftwareNode } from "@/components/canvas/software-node";
import { CustomNode } from "@/components/canvas/custom-node";
import { FunctionNode } from "@/components/canvas/function-node";
import { GroupNode } from "@/components/canvas/group-node";

const nodeTypes: NodeTypes = {
  softwareNode: SoftwareNode,
  customNode: CustomNode,
  functionNode: FunctionNode,
  groupNode: GroupNode,
};

interface ShareCanvasProps {
  nodes: unknown[];
  edges: unknown[];
}

function ShareCanvasInner({ nodes, edges }: ShareCanvasProps) {
  return (
    <ReactFlow
      nodes={nodes as Node[]}
      edges={edges as Edge[]}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll
      fitView
      fitViewOptions={{ padding: 0.2 }}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      <Controls showInteractive={false} />
      <MiniMap
        pannable={false}
        zoomable={false}
        className="!bg-card"
      />
    </ReactFlow>
  );
}

export function ShareCanvas({ nodes, edges }: ShareCanvasProps) {
  return (
    <ReactFlowProvider>
      <ShareCanvasInner nodes={nodes} edges={edges} />
    </ReactFlowProvider>
  );
}
