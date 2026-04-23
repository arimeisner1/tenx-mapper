interface CanvasNode {
  id: string;
  type?: string;
  data?: {
    label?: string;
    category?: string;
    color?: string;
    subtitle?: string;
    logoUrl?: string;
  };
  position?: { x: number; y: number };
  parentId?: string;
  style?: Record<string, unknown>;
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  data?: { label?: string };
}

interface NodeMetadata {
  nodeId: string;
  name: string;
  description?: string | null;
  notes?: string | null;
  links?: unknown;
  costEstimate?: string | null;
  apiEndpoint?: string | null;
  status?: string;
  customFields?: Record<string, string> | unknown | null;
}

interface WorkflowContext {
  id: string;
  name: string;
  description?: string | null;
  canvasData: { nodes: CanvasNode[]; edges: CanvasEdge[] };
  nodeMetadata: NodeMetadata[];
}

/**
 * Builds a structured text description of a workflow for Claude to analyze.
 */
export function buildWorkflowContext(workflow: WorkflowContext): string {
  const { canvasData, nodeMetadata } = workflow;
  const nodes: CanvasNode[] = canvasData?.nodes || [];
  const edges: CanvasEdge[] = canvasData?.edges || [];

  // Build metadata lookup
  const metaMap = new Map<string, NodeMetadata>();
  for (const m of nodeMetadata) {
    metaMap.set(m.nodeId, m);
  }

  // Identify groups
  const groups = nodes.filter((n) => n.type === "groupNode");
  const softwareNodes = nodes.filter(
    (n) => n.type === "softwareNode" || n.type === "customNode"
  );
  const functionNodes = nodes.filter((n) => n.type === "functionNode");

  // Build group membership
  const groupMembers = new Map<string, string[]>();
  for (const node of nodes) {
    if (node.parentId) {
      const members = groupMembers.get(node.parentId) || [];
      members.push(node.id);
      groupMembers.set(node.parentId, members);
    }
  }

  // Find function nodes connected to each software node
  const functionsByParent = new Map<string, CanvasNode[]>();
  for (const fn of functionNodes) {
    // Check edges for connections to software nodes
    const connectedTo = edges
      .filter((e) => e.source === fn.id || e.target === fn.id)
      .map((e) => (e.source === fn.id ? e.target : e.source));

    for (const parentId of connectedTo) {
      const parent = softwareNodes.find((n) => n.id === parentId);
      if (parent) {
        const fns = functionsByParent.get(parentId) || [];
        fns.push(fn);
        functionsByParent.set(parentId, fns);
      }
    }

    // Also check parentId relationship
    if (fn.parentId) {
      const fns = functionsByParent.get(fn.parentId) || [];
      if (!fns.find((f) => f.id === fn.id)) {
        fns.push(fn);
        functionsByParent.set(fn.parentId, fns);
      }
    }
  }

  const lines: string[] = [];

  // Header
  lines.push(`## Workflow: ${workflow.name}`);
  if (workflow.description) {
    lines.push(workflow.description);
  }
  lines.push("");

  // Software Tools
  if (softwareNodes.length > 0) {
    lines.push("## Software Tools:");
    for (let i = 0; i < softwareNodes.length; i++) {
      const node = softwareNodes[i];
      const meta = metaMap.get(node.id);
      const label = meta?.name || node.data?.label || node.id;
      const category = node.data?.category || "Uncategorized";

      lines.push(`${i + 1}. ${label} (${category})`);

      if (meta?.description) {
        lines.push(`   - Description: ${meta.description}`);
      }
      if (meta?.status) {
        lines.push(`   - Status: ${meta.status}`);
      }
      if (meta?.costEstimate) {
        lines.push(`   - Cost: ${meta.costEstimate}`);
      }
      if (meta?.apiEndpoint) {
        lines.push(`   - API: ${meta.apiEndpoint}`);
      }
      if (meta?.notes) {
        lines.push(`   - Notes: ${meta.notes}`);
      }

      // Links
      const links = Array.isArray(meta?.links) ? meta.links : [];
      if (links.length > 0) {
        lines.push(`   - Links: ${(links as string[]).join(", ")}`);
      }

      // Custom fields
      if (meta?.customFields && typeof meta.customFields === "object") {
        const entries = Object.entries(meta.customFields);
        if (entries.length > 0) {
          for (const [key, value] of entries) {
            lines.push(`   - ${key}: ${value}`);
          }
        }
      }

      // Function nodes
      const fns = functionsByParent.get(node.id) || [];
      if (fns.length > 0) {
        const fnLabels = fns
          .map((f) => f.data?.label || f.id)
          .join(", ");
        lines.push(`   - Functions: ${fnLabels}`);
      }
    }
    lines.push("");
  }

  // Function Nodes (standalone)
  const standaloneFunctions = functionNodes.filter((fn) => {
    for (const fns of functionsByParent.values()) {
      if (fns.find((f) => f.id === fn.id)) return false;
    }
    return true;
  });

  if (standaloneFunctions.length > 0) {
    lines.push("## Standalone Functions:");
    for (const fn of standaloneFunctions) {
      const meta = metaMap.get(fn.id);
      lines.push(`- ${meta?.name || fn.data?.label || fn.id}`);
      if (meta?.description) {
        lines.push(`  Description: ${meta.description}`);
      }
    }
    lines.push("");
  }

  // Connections
  if (edges.length > 0) {
    lines.push("## Connections:");
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      const sourceMeta = metaMap.get(edge.source);
      const targetMeta = metaMap.get(edge.target);

      const sourceName =
        sourceMeta?.name ||
        sourceNode?.data?.label ||
        edge.source;
      const targetName =
        targetMeta?.name ||
        targetNode?.data?.label ||
        edge.target;

      const edgeLabel =
        edge.label ||
        (edge.data as { label?: string } | undefined)?.label ||
        "";

      lines.push(
        `${i + 1}. ${sourceName} -> ${targetName}${edgeLabel ? `: ${edgeLabel}` : ""}`
      );
    }
    lines.push("");
  }

  // Groups
  if (groups.length > 0) {
    lines.push("## Groups:");
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const meta = metaMap.get(group.id);
      const groupName = meta?.name || group.data?.label || group.id;
      const memberIds = groupMembers.get(group.id) || [];
      const memberNames = memberIds.map((mid) => {
        const m = metaMap.get(mid);
        const n = nodes.find((nd) => nd.id === mid);
        return m?.name || n?.data?.label || mid;
      });

      lines.push(
        `${i + 1}. ${groupName}: contains ${memberNames.length > 0 ? memberNames.join(", ") : "(empty)"}`
      );
      if (meta?.description) {
        lines.push(`   Description: ${meta.description}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * System prompt that instructs Claude to act as an integration architect.
 */
export function getAnalyzeSystemPrompt(workflowContext: string): string {
  return `You are an expert integration architect and automation specialist. You are analyzing a software workflow map created by a user who wants to connect multiple software tools together.

Here is the workflow you are analyzing:

${workflowContext}

Your role is to:
1. Analyze the workflow map and understand what the user is trying to accomplish
2. Identify what APIs, webhooks, and connections are needed between the software tools
3. Generate step-by-step implementation instructions for building each integration
4. Provide actual code snippets for each connection (REST API calls, webhook handlers, etc.)
5. Suggest automation platforms (Zapier, Make/Integromat, n8n) where appropriate, and provide specific configuration steps
6. Flag any potential issues, rate limits, authentication requirements, or missing steps
7. Estimate complexity and time for each integration

Format your response in clear, well-structured markdown with headers, code blocks, and bullet points. Be specific and actionable - the user should be able to follow your instructions to actually build the integrations.`;
}

/**
 * Get task-specific system prompts for the generate endpoint.
 */
export function getTaskSystemPrompt(
  task: string,
  workflowContext: string
): string {
  const baseContext = `You are an expert integration architect analyzing the following software workflow:\n\n${workflowContext}\n\n`;

  switch (task) {
    case "implementation-plan":
      return `${baseContext}Generate a comprehensive, step-by-step implementation plan for building this entire workflow. Include:

1. **Prerequisites**: What accounts, API keys, and access you need for each tool
2. **Phase breakdown**: Break the implementation into logical phases
3. **For each phase**:
   - Specific steps with detailed instructions
   - Estimated time for each step
   - Dependencies on other steps
   - Testing criteria
4. **Architecture decisions**: Recommend whether to use direct API integrations, middleware (like Zapier/Make/n8n), or custom code
5. **Risk assessment**: Potential blockers and mitigation strategies
6. **Total estimated timeline**

Format as structured markdown with clear phases and numbered steps.`;

    case "api-connections":
      return `${baseContext}Generate production-ready code for all API connections in this workflow. For each connection:

1. **Authentication setup**: How to authenticate with each API (OAuth, API keys, etc.)
2. **Connection code**: Actual TypeScript/JavaScript code for each API integration
3. **Data mapping**: How data flows between the connected tools
4. **Error handling**: Retry logic, error responses, and fallback strategies
5. **Rate limiting**: How to handle API rate limits
6. **Webhook endpoints**: If webhooks are needed, provide the handler code

Provide complete, copy-pasteable code blocks with all necessary imports and configuration. Use TypeScript where possible.`;

    case "automation-scripts":
      return `${baseContext}Generate automation configurations for this workflow. Provide:

1. **Zapier Zaps**: Step-by-step Zap configurations for each automation
   - Trigger app and event
   - Action app and event
   - Field mappings
   - Filters and conditions

2. **Make (Integromat) Scenarios**: Module-by-module configuration
   - Module types and settings
   - Data mapping between modules
   - Error handlers and routers

3. **n8n Workflows**: Node-by-node setup
   - Node types and credentials
   - Expressions and data transformations
   - Workflow JSON (importable)

4. **Custom Scripts**: For any connections that can't be handled by automation platforms
   - Cron jobs or scheduled tasks
   - Webhook handlers
   - Data transformation scripts

Recommend the best platform for each specific automation based on complexity and cost.`;

    case "documentation":
      return `${baseContext}Generate comprehensive documentation for this workflow. Include:

1. **Overview**: What this workflow does and its business purpose
2. **Architecture Diagram** (text-based): How all the tools connect
3. **Tool Inventory**: Each tool with its role, pricing tier needed, and key features used
4. **Data Flow**: How data moves through the workflow, including:
   - Data formats and schemas
   - Transformation points
   - Storage locations
5. **Integration Details**: For each connection:
   - How it works
   - Authentication method
   - Key endpoints used
   - Data exchanged
6. **Maintenance Guide**: How to monitor, troubleshoot, and update the workflow
7. **Security Considerations**: Data handling, access controls, and compliance notes
8. **Cost Analysis**: Estimated monthly costs for all tools and APIs

Format as professional documentation with clear sections, tables, and diagrams where applicable.`;

    default:
      return `${baseContext}Analyze this workflow and provide helpful insights and recommendations. Focus on practical, actionable advice.`;
  }
}
