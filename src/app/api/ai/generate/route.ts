import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";
import { buildWorkflowContext, getTaskSystemPrompt } from "@/lib/ai";

const VALID_TASKS = [
  "implementation-plan",
  "api-connections",
  "automation-scripts",
  "documentation",
] as const;

type TaskType = (typeof VALID_TASKS)[number];

export async function POST(request: NextRequest) {
  const user = await getDefaultUser();

  const body = await request.json();
  const { workflowId, apiKey, task } = body;

  if (!workflowId) {
    return Response.json(
      { error: "workflowId is required" },
      { status: 400 }
    );
  }

  if (!task || !VALID_TASKS.includes(task as TaskType)) {
    return Response.json(
      {
        error: `Invalid task. Must be one of: ${VALID_TASKS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // Use provided API key or fetch from user settings
  let resolvedApiKey = apiKey;
  if (!resolvedApiKey) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { anthropicApiKey: true },
    });
    resolvedApiKey = dbUser?.anthropicApiKey;
  }

  if (!resolvedApiKey) {
    return Response.json(
      { error: "Anthropic API key is required. Please set it in your settings." },
      { status: 400 }
    );
  }

  // Fetch workflow with metadata
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      project: {
        OR: [
          { ownerId: user.id },
          { collaborators: { some: { userId: user.id } } },
        ],
      },
    },
    include: {
      nodeMetadata: true,
    },
  });

  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }

  // Build context from workflow
  const workflowContext = buildWorkflowContext({
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    canvasData: workflow.canvasData as { nodes: never[]; edges: never[] },
    nodeMetadata: workflow.nodeMetadata,
  });

  const systemPrompt = getTaskSystemPrompt(task, workflowContext);

  const taskDescriptions: Record<TaskType, string> = {
    "implementation-plan":
      "Generate a detailed, step-by-step implementation plan for building this entire workflow from scratch.",
    "api-connections":
      "Generate production-ready code for all API connections needed in this workflow.",
    "automation-scripts":
      "Generate automation configurations and scripts for platforms like Zapier, Make, and n8n to implement this workflow.",
    documentation:
      "Generate comprehensive technical documentation for this workflow.",
  };

  const userMessage = taskDescriptions[task as TaskType];

  try {
    const client = new Anthropic({ apiKey: resolvedApiKey });
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                new TextEncoder().encode(event.delta.text)
              );
            }
          }
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            new TextEncoder().encode(`\n\n[Error: ${message}]`)
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to call Claude API";
    return Response.json({ error: message }, { status: 500 });
  }
}
