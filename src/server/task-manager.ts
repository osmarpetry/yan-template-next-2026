import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";

import type {
  TaskEvent,
  TaskMode,
  TaskSnapshot,
  TaskStatus,
} from "@/lib/shared/tasks";

type Timer = ReturnType<typeof setTimeout>;

interface TaskRecord {
  snapshot: TaskSnapshot;
  timers: Set<Timer>;
}

interface CreateTaskInput {
  label?: string;
  mode?: TaskMode;
}

const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  QUEUED: ["RUNNING", "FAILED"],
  RUNNING: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: [],
};

function cloneSnapshot(snapshot: TaskSnapshot) {
  return structuredClone(snapshot);
}

export class TaskManager {
  private readonly emitter = new EventEmitter();
  private readonly tasks = new Map<string, TaskRecord>();

  createTask(input: CreateTaskInput = {}) {
    const now = new Date().toISOString();
    const snapshot: TaskSnapshot = {
      id: randomUUID(),
      label: input.label ?? "Sample template task",
      mode: input.mode ?? "success",
      status: "QUEUED",
      currentStage: "QUEUED",
      errorMessage: null,
      createdAt: now,
      updatedAt: now,
      events: [],
    };

    const record: TaskRecord = {
      snapshot,
      timers: new Set(),
    };

    this.tasks.set(snapshot.id, record);

    this.pushEvent(record, {
      eventType: "TASK_STAGE",
      stage: "QUEUED",
      message: "Task accepted into the in-memory runtime.",
    });

    this.scheduleLifecycle(record);

    return cloneSnapshot(record.snapshot);
  }

  getTask(taskId: string) {
    const record = this.tasks.get(taskId);
    return record ? cloneSnapshot(record.snapshot) : undefined;
  }

  onTaskEvent(listener: (snapshot: TaskSnapshot, event: TaskEvent) => void) {
    this.emitter.on("task:event", listener);
    return () => this.emitter.off("task:event", listener);
  }

  onTaskError(listener: (snapshot: TaskSnapshot, message: string) => void) {
    this.emitter.on("task:error", listener);
    return () => this.emitter.off("task:error", listener);
  }

  clear() {
    for (const record of this.tasks.values()) {
      for (const timer of record.timers) {
        clearTimeout(timer);
      }
    }

    this.tasks.clear();
  }

  private scheduleLifecycle(record: TaskRecord) {
    this.schedule(record, 150, () => {
      this.pushEvent(record, {
        eventType: "TASK_STAGE",
        stage: "PREPARE",
        message: "Bootstrapping the shared workspace.",
      });
    });

    this.schedule(record, 420, () => {
      this.pushEvent(record, {
        eventType: "TASK_CHUNK",
        stage: "STREAM",
        message: "Streaming sample progress over Socket.IO.",
        payloadJson: JSON.stringify({ chunk: "Socket checkpoint emitted." }),
      });
    });

    this.schedule(record, 720, () => {
      this.pushEvent(record, {
        eventType: "TASK_STAGE",
        stage: "VERIFY",
        message: "Verifying snapshot recovery for refreshes and reconnects.",
      });
    });

    this.schedule(record, 1_050, () => {
      if (record.snapshot.mode === "fail") {
        this.failTask(record, "Template task failed on purpose.");
        return;
      }

      this.completeTask(record, "Task completed with a durable snapshot.");
    });
  }

  private schedule(record: TaskRecord, delay: number, fn: () => void) {
    const timer = setTimeout(() => {
      record.timers.delete(timer);
      fn();
    }, delay);

    record.timers.add(timer);
  }

  private pushEvent(
    record: TaskRecord,
    input: Omit<TaskEvent, "createdAt" | "seq" | "taskId">,
  ) {
    if (
      input.stage !== "QUEUED" &&
      input.eventType !== "TASK_COMPLETED" &&
      input.eventType !== "TASK_FAILED" &&
      record.snapshot.status === "QUEUED"
    ) {
      this.transition(record, "RUNNING");
    }

    const event: TaskEvent = {
      taskId: record.snapshot.id,
      seq: record.snapshot.events.length + 1,
      createdAt: new Date().toISOString(),
      ...input,
    };

    record.snapshot.events = [...record.snapshot.events, event];
    record.snapshot.updatedAt = event.createdAt;
    record.snapshot.currentStage = event.stage ?? record.snapshot.currentStage ?? null;

    this.emitter.emit("task:event", cloneSnapshot(record.snapshot), event);
  }

  private transition(record: TaskRecord, nextStatus: TaskStatus) {
    const allowed = allowedTransitions[record.snapshot.status];

    if (!allowed.includes(nextStatus)) {
      throw new Error(
        `Invalid task transition: ${record.snapshot.status} -> ${nextStatus}`,
      );
    }

    record.snapshot.status = nextStatus;
  }

  private completeTask(record: TaskRecord, message: string) {
    this.transition(record, "COMPLETED");

    this.pushEvent(record, {
      eventType: "TASK_COMPLETED",
      stage: "DONE",
      message,
    });
  }

  private failTask(record: TaskRecord, message: string) {
    this.transition(record, "FAILED");
    record.snapshot.errorMessage = message;

    this.pushEvent(record, {
      eventType: "TASK_FAILED",
      stage: "FAILED",
      message,
    });

    this.emitter.emit("task:error", cloneSnapshot(record.snapshot), message);
  }
}
