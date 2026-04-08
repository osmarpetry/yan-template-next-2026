import { renderHook } from "@testing-library/react";

import { useTaskSubscription } from "@/lib/realtime/use-task-subscription";

const firstTaskId = "11111111-1111-1111-1111-111111111111";
const secondTaskId = "22222222-2222-2222-2222-222222222222";

class FakeSocket {
  connected = false;
  emitted: Array<{ event: string; payload: unknown }> = [];
  handlers = new Map<string, Set<(...args: unknown[]) => void>>();

  on(event: string, handler: (...args: unknown[]) => void) {
    const existing = this.handlers.get(event) ?? new Set();
    existing.add(handler);
    this.handlers.set(event, existing);
    return this;
  }

  off(event: string, handler: (...args: unknown[]) => void) {
    this.handlers.get(event)?.delete(handler);
    return this;
  }

  emit(event: string, payload: unknown) {
    this.emitted.push({ event, payload });
  }

  connect() {
    this.connected = true;
    this.handlers.get("connect")?.forEach((handler) => handler());
  }

  disconnect() {
    this.connected = false;
    this.handlers.get("disconnect")?.forEach((handler) => handler());
  }
}

describe("useTaskSubscription", () => {
  it("subscribes and unsubscribes correctly", () => {
    const socket = new FakeSocket();

    const { rerender, unmount } = renderHook(
      ({ taskId }) =>
        useTaskSubscription({
          taskId,
          socketFactory: () => socket,
        }),
      {
        initialProps: { taskId: firstTaskId as string | null },
      },
    );

    expect(socket.emitted).toContainEqual({
      event: "task:subscribe",
      payload: { taskId: firstTaskId },
    });

    rerender({ taskId: secondTaskId });

    expect(socket.emitted).toContainEqual({
      event: "task:unsubscribe",
      payload: { taskId: firstTaskId },
    });
    expect(socket.emitted).toContainEqual({
      event: "task:subscribe",
      payload: { taskId: secondTaskId },
    });

    unmount();

    expect(socket.emitted).toContainEqual({
      event: "task:unsubscribe",
      payload: { taskId: secondTaskId },
    });
  });
});
