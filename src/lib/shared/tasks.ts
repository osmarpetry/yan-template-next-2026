import { z } from "zod";

export const taskStatuses = ["QUEUED", "RUNNING", "COMPLETED", "FAILED"] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export const taskEventTypes = [
  "TASK_STAGE",
  "TASK_CHUNK",
  "TASK_COMPLETED",
  "TASK_FAILED",
] as const;

export type TaskEventType = (typeof taskEventTypes)[number];

export type TaskMode = "success" | "fail";
export type TransportState = "connecting" | "ready" | "closed" | "error";

export interface TaskEvent {
  taskId: string;
  seq: number;
  eventType: TaskEventType;
  stage?: string | null;
  message: string;
  payloadJson?: string | null;
  createdAt: string;
}

export interface TaskSnapshot {
  id: string;
  label: string;
  mode: TaskMode;
  status: TaskStatus;
  currentStage?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  events: TaskEvent[];
}

export interface TaskTransportError {
  taskId?: string;
  message: string;
}

export interface ClientToServerEvents {
  "task:subscribe": (payload: TaskSubscription) => void;
  "task:unsubscribe": (payload: TaskSubscription) => void;
}

export interface ServerToClientEvents {
  "task:event": (event: TaskEvent) => void;
  "task:snapshot": (snapshot: TaskSnapshot) => void;
  "task:error": (error: TaskTransportError) => void;
}

export const taskEventSchema = z.object({
  taskId: z.string().uuid(),
  seq: z.number().int().nonnegative(),
  eventType: z.enum(taskEventTypes),
  stage: z.string().nullable().optional(),
  message: z.string().min(1),
  payloadJson: z.string().nullable().optional(),
  createdAt: z.string().min(1),
});

export const taskSnapshotSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  mode: z.enum(["success", "fail"]),
  status: z.enum(taskStatuses),
  currentStage: z.string().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  events: z.array(taskEventSchema),
});

export const createTaskRequestSchema = z.object({
  label: z.string().min(1).max(80).optional(),
  mode: z.enum(["success", "fail"]).optional(),
});

export const taskSubscriptionSchema = z.object({
  taskId: z.string().uuid(),
});

export type TaskSubscription = z.infer<typeof taskSubscriptionSchema>;
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>;

export function taskStatusLabel(status: TaskStatus) {
  switch (status) {
    case "QUEUED":
      return "Queued";
    case "RUNNING":
      return "Running";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
  }
}

export function applyTaskEvent(
  snapshot: TaskSnapshot | null,
  event: TaskEvent,
): TaskSnapshot | null {
  if (!snapshot || snapshot.id !== event.taskId) {
    return snapshot;
  }

  if (snapshot.events.some((entry) => entry.seq === event.seq)) {
    return snapshot;
  }

  const events = [...snapshot.events, event].sort((left, right) => left.seq - right.seq);

  let status = snapshot.status;
  let errorMessage = snapshot.errorMessage ?? null;

  if (event.eventType === "TASK_FAILED") {
    status = "FAILED";
    errorMessage = event.message;
  } else if (event.eventType === "TASK_COMPLETED") {
    status = "COMPLETED";
  } else if (status === "QUEUED") {
    status = "RUNNING";
  }

  return {
    ...snapshot,
    status,
    currentStage: event.stage ?? snapshot.currentStage ?? null,
    errorMessage,
    updatedAt: event.createdAt,
    events,
  };
}
