import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "@/lib/default-user";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const user = await getDefaultUser();

  const body = await request.json();
  const { projectId, name, description } = body;

  if (!projectId || !name) {
    return Response.json(
      { error: "projectId and name are required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } },
      ],
    },
  });

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const workflow = await prisma.workflow.create({
    data: {
      name,
      description: description || null,
      projectId,
      shareToken: nanoid(12),
    },
  });

  return Response.json(workflow, { status: 201 });
}
