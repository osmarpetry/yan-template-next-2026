/* @vitest-environment node */

import { TaskManager } from "@/server/task-manager";

describe("TaskManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("emits increasing sequence numbers", () => {
    const manager = new TaskManager();
    const snapshot = manager.createTask();

    vi.advanceTimersByTime(2_000);

    const finalSnapshot = manager.getTask(snapshot.id);
    expect(finalSnapshot).toBeDefined();
    expect(finalSnapshot?.events.map((event) => event.seq)).toEqual([1, 2, 3, 4, 5]);
  });

  it("moves through valid status transitions", () => {
    const manager = new TaskManager();
    const snapshot = manager.createTask();

    expect(snapshot.status).toBe("QUEUED");

    vi.advanceTimersByTime(200);
    expect(manager.getTask(snapshot.id)?.status).toBe("RUNNING");

    vi.advanceTimersByTime(2_000);
    expect(manager.getTask(snapshot.id)?.status).toBe("COMPLETED");
  });
});
