import { getTaskSnapshot } from "@/server/api/task-service";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    taskId: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  const snapshot = getTaskSnapshot(taskId);

  if (!snapshot) {
    return Response.json({ message: "Task not found." }, { status: 404 });
  }

  return Response.json(snapshot);
}
