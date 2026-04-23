// Demo AI responses for testing without an API key
// Simulates streaming by yielding chunks with delays

export function getDemoAnalysis(workflowName: string, nodeNames: string[]): string {
  const toolList = nodeNames.map((n, i) => `${i + 1}. **${n}**`).join("\n");
  return `# Workflow Analysis: ${workflowName}

## Overview
This workflow connects ${nodeNames.length} software tools to create an automated pipeline. Here's a comprehensive breakdown of the integrations needed.

## Tools Identified
${toolList}

## Integration Architecture

### Data Flow
The workflow follows a ${nodeNames.length > 5 ? "multi-stage" : "linear"} pipeline pattern where data flows through each tool sequentially with some parallel branches.

### API Connections Needed
${nodeNames.slice(0, -1).map((n, i) => `- **${n} → ${nodeNames[i + 1]}**: REST API / Webhook integration`).join("\n")}

### Authentication Requirements
Each tool requires its own API credentials:
${nodeNames.map((n) => `- **${n}**: API key or OAuth 2.0 token`).join("\n")}

## Implementation Steps

### Phase 1: Set Up Core Integrations
1. Create API accounts for each service
2. Generate API keys and store securely
3. Set up webhook endpoints for real-time triggers

### Phase 2: Build Data Pipeline
1. Define data schemas for each integration point
2. Build transformation layers between tools
3. Implement error handling and retry logic

### Phase 3: Testing & Monitoring
1. Test each integration independently
2. Run end-to-end workflow tests
3. Set up monitoring and alerting

## Potential Issues
- **Rate limiting**: Some APIs have strict rate limits
- **Data format mismatches**: May need transformation layers
- **Authentication expiry**: OAuth tokens need refresh logic
- **Error propagation**: Need circuit breakers between services

## Cost Estimate
Based on typical usage patterns, this workflow would cost approximately $50-200/month depending on volume.

---
*This is a demo analysis. Connect your Claude API key for detailed, context-aware analysis.*`;
}

export function getDemoImplementationPlan(workflowName: string, nodeNames: string[]): string {
  return `# Implementation Plan: ${workflowName}

## Prerequisites
- Node.js 18+ installed
- API keys for: ${nodeNames.join(", ")}
- A server or serverless platform for hosting

## Step-by-Step Implementation

${nodeNames.map((name, i) => `### Step ${i + 1}: Set Up ${name} Integration
1. Create an account and generate API credentials
2. Install the SDK: \`npm install ${name.toLowerCase().replace(/\s+/g, "-")}-sdk\`
3. Configure environment variables
4. Build the integration module
5. Write tests

\`\`\`typescript
// ${name.toLowerCase().replace(/\s+/g, "-")}-integration.ts
export async function connect${name.replace(/\s+/g, "")}() {
  // Initialize client with API key
  const client = new ${name.replace(/\s+/g, "")}Client({
    apiKey: process.env.${name.toUpperCase().replace(/\s+/g, "_")}_API_KEY
  });
  return client;
}
\`\`\`
`).join("\n")}

## Timeline
- **Week 1**: Core integrations (${nodeNames.slice(0, 3).join(", ")})
- **Week 2**: Secondary integrations (${nodeNames.slice(3).join(", ")})
- **Week 3**: Testing, monitoring, deployment

---
*This is a demo plan. Connect your Claude API key for production-ready implementation details.*`;
}

export function getDemoResponse(task: string, workflowName: string, nodeNames: string[]): string {
  switch (task) {
    case "implementation-plan":
      return getDemoImplementationPlan(workflowName, nodeNames);
    case "api-connections":
      return `# API Connection Code: ${workflowName}\n\n${nodeNames.map((n) => `## ${n}\n\`\`\`typescript\n// ${n.toLowerCase().replace(/\s+/g, "-")}.ts\nimport axios from 'axios';\n\nconst ${n.replace(/\s+/g, "").toLowerCase()}Client = axios.create({\n  baseURL: 'https://api.${n.toLowerCase().replace(/\s+/g, "")}.com/v1',\n  headers: { 'Authorization': \`Bearer \${process.env.${n.toUpperCase().replace(/\s+/g, "_")}_KEY}\` }\n});\n\nexport async function fetch${n.replace(/\s+/g, "")}Data() {\n  const response = await ${n.replace(/\s+/g, "").toLowerCase()}Client.get('/data');\n  return response.data;\n}\n\`\`\`\n`).join("\n")}\n\n---\n*Demo code. Connect your Claude API key for production-ready integrations.*`;
    case "automation-scripts":
      return `# Automation Scripts: ${workflowName}\n\n## Zapier Configuration\n${nodeNames.slice(0, -1).map((n, i) => `### Zap ${i + 1}: ${n} → ${nodeNames[i + 1]}\n- **Trigger**: ${n} - New Event\n- **Action**: ${nodeNames[i + 1]} - Create/Update Record\n- **Transform**: Map fields between schemas\n`).join("\n")}\n\n## n8n Workflow\n\`\`\`json\n{\n  "name": "${workflowName}",\n  "nodes": ${JSON.stringify(nodeNames.map((n, i) => ({ name: n, type: "n8n-node", position: [250 * i, 300] })), null, 2)}\n}\n\`\`\`\n\n---\n*Demo scripts. Connect your Claude API key for complete automation configs.*`;
    case "documentation":
      return `# Technical Documentation: ${workflowName}\n\n## Overview\nThis document describes the ${workflowName} workflow, which connects ${nodeNames.length} services.\n\n## Architecture\n${nodeNames.map((n, i) => `### ${i + 1}. ${n}\n- **Role**: ${i === 0 ? "Entry point / trigger" : i === nodeNames.length - 1 ? "Final output / reporting" : "Processing / transformation"}\n- **Integration Type**: REST API\n- **Data Format**: JSON\n`).join("\n")}\n\n## Data Flow Diagram\n\`\`\`\n${nodeNames.join(" → ")}\n\`\`\`\n\n## Error Handling\nEach integration includes retry logic with exponential backoff.\n\n---\n*Demo documentation. Connect your Claude API key for comprehensive docs.*`;
    default:
      return getDemoAnalysis(workflowName, nodeNames);
  }
}

export function createDemoStream(text: string): ReadableStream {
  const encoder = new TextEncoder();
  const words = text.split(" ");

  return new ReadableStream({
    async start(controller) {
      // Stream word by word with small delays to simulate AI
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(encoder.encode(chunk));
        // Small delay every few words to simulate streaming
        if (i % 5 === 0) {
          await new Promise((r) => setTimeout(r, 20));
        }
      }
      controller.close();
    },
  });
}
