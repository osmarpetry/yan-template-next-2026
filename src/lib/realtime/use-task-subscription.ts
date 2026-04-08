"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import type {
  TaskEvent,
  TaskSnapshot,
  TaskTransportError,
  TransportState,
} from "@/lib/shared/tasks";
import { createTaskSocketClient } from "@/lib/realtime/socket-client";

export interface TaskSocketLike {
  connected: boolean;
  on(...args: unknown[]): TaskSocketLike;
  off(...args: unknown[]): TaskSocketLike;
  emit(...args: unknown[]): void;
  connect(): void;
  disconnect(): void;
}

interface UseTaskSubscriptionOptions {
  taskId: string | null;
  onEvent?: (event: TaskEvent) => void;
  onSnapshot?: (snapshot: TaskSnapshot) => void;
  onError?: (error: TaskTransportError) => void;
  socketFactory?: () => TaskSocketLike;
}

export function useTaskSubscription({
  taskId,
  onEvent,
  onSnapshot,
  onError,
  socketFactory = createTaskSocketClient as unknown as () => TaskSocketLike,
}: UseTaskSubscriptionOptions) {
  const socketRef = useRef<TaskSocketLike | null>(null);
  const activeTaskIdRef = useRef<string | null>(taskId);
  const subscribedTaskIdRef = useRef<string | null>(null);
  const [transportState, setTransportState] =
    useState<TransportState>("closed");

  const handleEvent = useEffectEvent((event: TaskEvent) => {
    onEvent?.(event);
  });

  const handleSnapshot = useEffectEvent((snapshot: TaskSnapshot) => {
    onSnapshot?.(snapshot);
  });

  const handleError = useEffectEvent((error: TaskTransportError) => {
    setTransportState("error");
    onError?.(error);
  });

  useEffect(() => {
    activeTaskIdRef.current = taskId;
  }, [taskId]);

  useEffect(() => {
    const socket = socketFactory();
    socketRef.current = socket;

    const onConnect = () => {
      setTransportState("ready");

      if (
        activeTaskIdRef.current &&
        subscribedTaskIdRef.current !== activeTaskIdRef.current
      ) {
        socket.emit("task:subscribe", { taskId: activeTaskIdRef.current });
        subscribedTaskIdRef.current = activeTaskIdRef.current;
      }
    };

    const onDisconnect = () => {
      subscribedTaskIdRef.current = null;
      setTransportState("closed");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("task:event", handleEvent as (...args: unknown[]) => void);
    socket.on("task:snapshot", handleSnapshot as (...args: unknown[]) => void);
    socket.on("task:error", handleError as (...args: unknown[]) => void);

    if (activeTaskIdRef.current) {
      socket.connect();
    }

    return () => {
      if (subscribedTaskIdRef.current) {
        socket.emit("task:unsubscribe", { taskId: subscribedTaskIdRef.current });
        subscribedTaskIdRef.current = null;
      }

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("task:event", handleEvent as (...args: unknown[]) => void);
      socket.off("task:snapshot", handleSnapshot as (...args: unknown[]) => void);
      socket.off("task:error", handleError as (...args: unknown[]) => void);
      socket.disconnect();
      socketRef.current = null;
      setTransportState("closed");
    };
  }, [socketFactory]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    if (!taskId) {
      if (subscribedTaskIdRef.current) {
        socket.emit("task:unsubscribe", { taskId: subscribedTaskIdRef.current });
        subscribedTaskIdRef.current = null;
      }
      return;
    }

    if (!socket.connected) {
      socket.connect();
      return;
    }

    if (subscribedTaskIdRef.current && subscribedTaskIdRef.current !== taskId) {
      socket.emit("task:unsubscribe", { taskId: subscribedTaskIdRef.current });
      subscribedTaskIdRef.current = null;
    }

    if (subscribedTaskIdRef.current !== taskId) {
      socket.emit("task:subscribe", { taskId });
      subscribedTaskIdRef.current = taskId;
    }

    return () => {
      if (subscribedTaskIdRef.current === taskId) {
        socket.emit("task:unsubscribe", { taskId });
        subscribedTaskIdRef.current = null;
      }
    };
  }, [taskId]);

  return {
    transportState,
    reconnect() {
      const socket = socketRef.current;
      if (!socket || !activeTaskIdRef.current) {
        return;
      }

      setTransportState("connecting");
      socket.disconnect();
      socket.connect();
    },
  };
}
