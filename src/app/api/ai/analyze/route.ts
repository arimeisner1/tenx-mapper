import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";
import { buildWorkflowContext, getAnalyzeSystemPrompt } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const user = await getDefaultUser();

  const body = await request.json();
  const { workflowId, apiKey, prompt } = body;

  if (!workflowId) {
    return Response.json(
      { error: "workflowId is required" },
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

  const systemPrompt = getAnalyzeSystemPrompt(workflowContext);

  // Build user message
  let userMessage = "Please analyze this workflow map and provide a comprehensive breakdown of what integrations are needed, how to build them, and any potential issues.";
  if (prompt) {
    userMessage += `\n\nAdditional instructions from the user:\n${prompt}`;
  }

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
