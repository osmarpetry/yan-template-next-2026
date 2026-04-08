import type { TaskEvent, TaskSnapshot, TransportState } from "./tasks";

export interface TaskLine {
  id: string;
  prefix: string;
  message: string;
  tone: "default" | "success" | "warning" | "danger" | "info";
}

export function buildTaskLines(snapshot: TaskSnapshot | null): TaskLine[] {
  if (!snapshot) {
    return [
      {
        id: "intro-1",
        prefix: "READY",
        message: "Starter runtime booted. Create a sample task to inspect the flow.",
        tone: "info",
      },
      {
        id: "intro-2",
        prefix: "STACK",
        message:
          "HTTP creates state, Socket.IO streams progress, snapshots recover refreshes.",
        tone: "default",
      },
    ];
  }

  return [...snapshot.events]
    .sort((left, right) => left.seq - right.seq)
    .map((event) => formatTaskEvent(event));
}

export function formatTaskEvent(event: TaskEvent): TaskLine {
  switch (event.eventType) {
    case "TASK_STAGE":
      return {
        id: `${event.taskId}-${event.seq}`,
        prefix: event.stage ?? "STAGE",
        message: event.message,
        tone: "info",
      };
    case "TASK_CHUNK":
      return {
        id: `${event.taskId}-${event.seq}`,
        prefix: event.stage ?? "STREAM",
        message: event.message,
        tone: "default",
      };
    case "TASK_COMPLETED":
      return {
        id: `${event.taskId}-${event.seq}`,
        prefix: "DONE",
        message: event.message,
        tone: "success",
      };
    case "TASK_FAILED":
      return {
        id: `${event.taskId}-${event.seq}`,
        prefix: "FAIL",
        message: event.message,
        tone: "danger",
      };
  }
}

export function transportStateLabel(transportState: TransportState) {
  switch (transportState) {
    case "connecting":
      return "Transport connecting";
    case "ready":
      return "Transport ready";
    case "closed":
      return "Transport idle";
    case "error":
      return "Transport error";
  }
}
