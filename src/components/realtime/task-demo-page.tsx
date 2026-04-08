"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LayoutShell } from "@/components/layout/layout-shell";
import { TaskFeed } from "@/components/realtime/task-feed";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { applyTaskEvent, taskSnapshotSchema, type TaskMode, type TaskSnapshot } from "@/lib/shared/tasks";
import { useTaskSubscription } from "@/lib/realtime/use-task-subscription";

async function fetchTaskSnapshot(taskId: string) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load the active task snapshot.");
  }

  return taskSnapshotSchema.parse(await response.json());
}

export function TaskDemoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTaskId = searchParams.get("taskId");

  const [task, setTask] = useState<TaskSnapshot | null>(null);
  const [taskId, setTaskId] = useState<string | null>(queryTaskId);
  const [submittingMode, setSubmittingMode] = useState<TaskMode | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const { transportState, reconnect } = useTaskSubscription({
    taskId,
    onSnapshot: (snapshot) => {
      startTransition(() => {
        setTask(snapshot);
        setTaskId(snapshot.id);
        setRequestError(null);
      });
    },
    onEvent: (event) => {
      startTransition(() => {
        setTask((current) => applyTaskEvent(current, event));
      });
    },
    onError: (error) => {
      setRequestError(error.message);
    },
  });

  useEffect(() => {
    setTaskId(queryTaskId);

    if (!queryTaskId) {
      setTask(null);
      setRequestError(null);
      return;
    }

    if (task?.id === queryTaskId) {
      return;
    }

    void fetchTaskSnapshot(queryTaskId)
      .then((snapshot) => {
        startTransition(() => {
          setTask(snapshot);
          setTaskId(snapshot.id);
          setRequestError(null);
        });
      })
      .catch((error) => {
        setRequestError(
          error instanceof Error ? error.message : "Unable to restore the task.",
        );
      });
  }, [queryTaskId, task?.id]);

  async function startTask(mode: TaskMode) {
    try {
      setSubmittingMode(mode);
      setRequestError(null);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          label: mode === "fail" ? "Failing example task" : "Sample template task",
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Task creation failed.");
      }

      const snapshot = taskSnapshotSchema.parse(await response.json());
      startTransition(() => {
        setTask(snapshot);
        setTaskId(snapshot.id);
        setRequestError(null);
      });
      router.replace(`/?taskId=${snapshot.id}`, { scroll: false });
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Task creation failed.",
      );
    } finally {
      setSubmittingMode(null);
    }
  }

  function resetTask() {
    setTask(null);
    setTaskId(null);
    setRequestError(null);
    router.replace("/", { scroll: false });
  }

  return (
    <LayoutShell
      hero={
        <Panel
          className="grain-overlay notebook-texture isolate flex h-full flex-col gap-6"
          tone="paper"
        >
          <div className="space-y-4">
            <p className="font-mono text-[0.74rem] uppercase tracking-[0.2em] text-text-secondary">
              Product foundation
            </p>
            <div className="space-y-3">
              <h2 className="max-w-xl font-display text-4xl leading-none text-text-primary md:text-5xl">
                Build real-time product slices without rebuilding your stack.
              </h2>
              <p className="max-w-xl text-base leading-7 text-text-secondary">
                This starter ships with the boring parts already wired: semantic
                tokens, custom server boot, Socket.IO, Storybook, unit tests,
                API integration coverage, and BDD browser flows.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel padding="dense" tone="subtle">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
                Quality layers
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-text-primary">
                <li>Vitest + RTL for components and hooks</li>
                <li>Vitest API tests against the running app server</li>
                <li>Playwright BDD for feature-level acceptance</li>
                <li>Storybook with token documentation and visual contracts</li>
              </ul>
            </Panel>

            <Panel padding="dense" tone="subtle">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
                Realtime contract
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-text-primary">
                <li>`POST /api/tasks` creates durable in-memory state</li>
                <li>`GET /api/tasks/:taskId` restores refreshes and reconnects</li>
                <li>`task:snapshot` hydrates new listeners immediately</li>
                <li>`task:event` streams ordered progress updates</li>
              </ul>
            </Panel>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Button
              onClick={() => void startTask("success")}
              disabled={submittingMode !== null}
            >
              {submittingMode === "success" ? "Starting task..." : "Start Sample Task"}
            </Button>
            <Button
              tone="secondary"
              onClick={() => void startTask("fail")}
              disabled={submittingMode !== null}
            >
              {submittingMode === "fail" ? "Starting failure..." : "Start Failing Task"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button tone="ghost" onClick={reconnect} disabled={!taskId}>
              Reconnect Stream
            </Button>
            <Button tone="ghost" onClick={resetTask}>
              Reset Demo
            </Button>
          </div>

          <Panel padding="dense" tone="subtle">
            <div className="flex flex-col gap-2 font-mono text-xs text-text-secondary">
              <div className="flex items-center justify-between gap-4">
                <span>Active task</span>
                <span data-testid="active-task-id">{taskId ?? "none"}</span>
              </div>
              {requestError ? (
                <div className="text-status-danger">{requestError}</div>
              ) : null}
            </div>
          </Panel>
        </Panel>
      }
      realtime={<TaskFeed snapshot={task} transportState={transportState} />}
      footer={
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel padding="dense" tone="subtle">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
              Generators
            </p>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              `plop` ships with component, server-module, and feature generators
              so the starter stays opinionated after day one.
            </p>
          </Panel>
          <Panel padding="dense" tone="subtle">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
              Token-first styling
            </p>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              Raw and semantic tokens live in TypeScript, generate CSS variables,
              and drive Tailwind semantic utilities without raw hex classes.
            </p>
          </Panel>
          <Panel padding="dense" tone="subtle">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
              Custom server
            </p>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              The template boots through `server.ts`, attaches Socket.IO once,
              and keeps route handlers thin by pushing work into `src/server/*`.
            </p>
          </Panel>
        </div>
      }
    />
  );
}
