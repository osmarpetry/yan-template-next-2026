"use client";

import { io, type Socket } from "socket.io-client";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/lib/shared/tasks";

export type TaskSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createTaskSocketClient() {
  return io({
    autoConnect: false,
    path: "/socket.io",
    transports: ["websocket"],
  });
}
