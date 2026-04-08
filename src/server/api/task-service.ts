import {
  createTaskRequestSchema,
  type CreateTaskRequest,
} from "@/lib/shared/tasks";
import { taskManager } from "@/server/runtime";

export function parseCreateTaskInput(payload: unknown): CreateTaskRequest {
  return createTaskRequestSchema.parse(payload);
}

export function createTask(payload: unknown) {
  const input = parseCreateTaskInput(payload);

  return taskManager.createTask({
    label: input.label,
    mode: input.mode,
  });
}

export function getTaskSnapshot(taskId: string) {
  return taskManager.getTask(taskId);
}
