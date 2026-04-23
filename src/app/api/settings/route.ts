import { NextRequest } from "next/server";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getDefaultUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { anthropicApiKey: true },
  });

  if (!dbUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Mask the API key for display: show first 7 and last 4 characters
  let maskedKey: string | null = null;
  if (dbUser.anthropicApiKey) {
    const key = dbUser.anthropicApiKey;
    if (key.length > 12) {
      maskedKey = `${key.slice(0, 7)}${"*".repeat(key.length - 11)}${key.slice(-4)}`;
    } else {
      maskedKey = "****";
    }
  }

  return Response.json({
    anthropicApiKey: maskedKey,
    hasApiKey: !!dbUser.anthropicApiKey,
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getDefaultUser();

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
    where: { id: user.id },
    data: {
      anthropicApiKey: anthropicApiKey || null,
    },
  });

  return Response.json({ success: true });
}
