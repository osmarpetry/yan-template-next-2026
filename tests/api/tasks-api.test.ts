/* @vitest-environment node */

import { io } from "socket.io-client";

import { taskSnapshotSchema, type TaskEvent } from "@/lib/shared/tasks";
import { taskManager } from "@/server/runtime";
import { startTestServer } from "./support/test-server";

async function waitFor<T>(
  factory: () => T | Promise<T>,
  timeoutMs = 4_000,
  intervalMs = 50,
): Promise<T> {
  const startedAt = Date.now();

  while (true) {
    const value = await factory();
    if (value) {
      return value;
    }

    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("Timed out while waiting for test condition.");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

describe("tasks API", () => {
  let baseUrl = "";
  let closeServer: (() => Promise<void>) | undefined;

  beforeAll(async () => {
    const server = await startTestServer();
    baseUrl = server.baseUrl;
    closeServer = server.close;
  });

  beforeEach(() => {
    taskManager.clear();
  });

  afterAll(async () => {
    await closeServer?.();
  });

  it("POST /api/tasks creates a task", async () => {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ label: "API task" }),
    });

    expect(response.status).toBe(201);

    const body = taskSnapshotSchema.parse(await response.json());
    expect(body.label).toBe("API task");
    expect(body.status).toBe("QUEUED");
  });

  it("GET /api/tasks/:taskId returns the current snapshot", async () => {
    const created = await fetch(`${baseUrl}/api/tasks`, { method: "POST" });
    const task = taskSnapshotSchema.parse(await created.json());

    const response = await fetch(`${baseUrl}/api/tasks/${task.id}`);
    const body = taskSnapshotSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(body.id).toBe(task.id);
  });

  it("socket subscriptions receive task:event messages", async () => {
    const created = await fetch(`${baseUrl}/api/tasks`, { method: "POST" });
    const task = taskSnapshotSchema.parse(await created.json());

    const events: TaskEvent[] = [];
    const socket = io(baseUrl, {
      autoConnect: false,
      path: "/socket.io",
      transports: ["websocket"],
    });

    socket.on("task:event", (event) => {
      events.push(event);
    });

    socket.connect();
    await waitFor(() => socket.connected);
    socket.emit("task:subscribe", { taskId: task.id });

    await waitFor(() => events.find((event) => event.eventType === "TASK_CHUNK"));

    expect(events.length).toBeGreaterThan(0);
    socket.disconnect();
  });

  it("failed sample tasks emit a consistent failure signal", async () => {
    const created = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ mode: "fail" }),
    });
    const task = taskSnapshotSchema.parse(await created.json());

    let receivedTaskError = false;
    let receivedTaskFailed = false;

    const socket = io(baseUrl, {
      autoConnect: false,
      path: "/socket.io",
      transports: ["websocket"],
    });

    socket.on("task:error", () => {
      receivedTaskError = true;
    });

    socket.on("task:event", (event) => {
      if (event.eventType === "TASK_FAILED") {
        receivedTaskFailed = true;
      }
    });

    socket.connect();
    await waitFor(() => socket.connected);
    socket.emit("task:subscribe", { taskId: task.id });

    await waitFor(() => receivedTaskError || receivedTaskFailed);

    expect(receivedTaskError || receivedTaskFailed).toBe(true);
    socket.disconnect();
  });
});
