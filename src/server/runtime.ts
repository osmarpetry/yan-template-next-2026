import { TaskManager } from "@/server/task-manager";

declare global {
  var __yanTemplateTaskManager: TaskManager | undefined;
}

export const taskManager =
  globalThis.__yanTemplateTaskManager ?? new TaskManager();

if (process.env.NODE_ENV !== "production") {
  globalThis.__yanTemplateTaskManager = taskManager;
}
