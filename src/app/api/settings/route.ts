import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { anthropicApiKey: true },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Mask the API key for display: show first 7 and last 4 characters
  let maskedKey: string | null = null;
  if (user.anthropicApiKey) {
    const key = user.anthropicApiKey;
    if (key.length > 12) {
      maskedKey = `${key.slice(0, 7)}${"*".repeat(key.length - 11)}${key.slice(-4)}`;
    } else {
      maskedKey = "****";
    }
  }

  return Response.json({
    anthropicApiKey: maskedKey,
    hasApiKey: !!user.anthropicApiKey,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { anthropicApiKey } = body;

  if (anthropicApiKey !== undefined && anthropicApiKey !== null) {
    // Basic validation: Anthropic keys start with "sk-ant-"
    if (
      typeof anthropicApiKey === "string" &&
      anthropicApiKey.length > 0 &&
      !anthropicApiKey.startsWith("sk-ant-")
    ) {
      return Response.json(
        { error: "Invalid API key format. Anthropic API keys start with 'sk-ant-'" },
        { status: 400 }
      );
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      anthropicApiKey: anthropicApiKey || null,
    },
  });

  return Response.json({ success: true });
}
