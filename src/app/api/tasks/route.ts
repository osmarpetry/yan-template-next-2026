import { z } from "zod";

import { createTask } from "@/server/api/task-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request
      .json()
      .catch(() => ({} satisfies Record<string, never>));

    const snapshot = createTask(payload);
    return Response.json(snapshot, { status: 201 });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message ?? "Invalid task payload."
        : "Task creation failed.";

    return Response.json({ message }, { status: 400 });
  }
}
