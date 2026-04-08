import type { Server } from "socket.io";

import {
  taskSubscriptionSchema,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@/lib/shared/tasks";
import { taskManager } from "@/server/runtime";

type TaskIoServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function registerTaskSocketHandlers(io: TaskIoServer) {
  const unsubscribeFromTaskEvents = taskManager.onTaskEvent((snapshot, event) => {
    io.to(snapshot.id).emit("task:event", event);
  });

  const unsubscribeFromTaskErrors = taskManager.onTaskError((snapshot, message) => {
    io.to(snapshot.id).emit("task:error", { taskId: snapshot.id, message });
  });

  io.on("connection", (socket) => {
    socket.on("task:subscribe", (payload) => {
      const parsed = taskSubscriptionSchema.safeParse(payload);

      if (!parsed.success) {
        socket.emit("task:error", {
          message: "Invalid task subscription payload.",
        });
        return;
      }

      const { taskId } = parsed.data;
      socket.join(taskId);

      const snapshot = taskManager.getTask(taskId);
      if (!snapshot) {
        socket.emit("task:error", {
          taskId,
          message: "Task not found.",
        });
        return;
      }

      socket.emit("task:snapshot", snapshot);
    });

    socket.on("task:unsubscribe", (payload) => {
      const parsed = taskSubscriptionSchema.safeParse(payload);
      if (!parsed.success) {
        return;
      }

      socket.leave(parsed.data.taskId);
    });
  });

  return () => {
    unsubscribeFromTaskEvents();
    unsubscribeFromTaskErrors();
  };
}
