import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TaskFeed } from "@/components/realtime/task-feed";
import type { TaskSnapshot } from "@/lib/shared/tasks";

const runningSnapshot: TaskSnapshot = {
  id: "33333333-3333-3333-3333-333333333333",
  label: "Story task",
  mode: "success",
  status: "RUNNING",
  currentStage: "VERIFY",
  errorMessage: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  events: [
    {
      taskId: "33333333-3333-3333-3333-333333333333",
      seq: 1,
      eventType: "TASK_STAGE",
      stage: "QUEUED",
      message: "Task accepted into the in-memory runtime.",
      createdAt: new Date().toISOString(),
    },
    {
      taskId: "33333333-3333-3333-3333-333333333333",
      seq: 2,
      eventType: "TASK_STAGE",
      stage: "PREPARE",
      message: "Bootstrapping the shared workspace.",
      createdAt: new Date().toISOString(),
    },
    {
      taskId: "33333333-3333-3333-3333-333333333333",
      seq: 3,
      eventType: "TASK_CHUNK",
      stage: "STREAM",
      message: "Streaming sample progress over Socket.IO.",
      createdAt: new Date().toISOString(),
    },
  ],
};

const meta = {
  title: "Realtime/TaskFeed",
  component: TaskFeed,
  tags: ["autodocs"],
  args: {
    snapshot: runningSnapshot,
    transportState: "ready",
  },
} satisfies Meta<typeof TaskFeed>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Running: Story = {};

export const Completed: Story = {
  args: {
    snapshot: {
      ...runningSnapshot,
      status: "COMPLETED",
      currentStage: "DONE",
      events: [
        ...runningSnapshot.events,
        {
          taskId: runningSnapshot.id,
          seq: 4,
          eventType: "TASK_COMPLETED",
          stage: "DONE",
          message: "Task completed with a durable snapshot.",
          createdAt: new Date().toISOString(),
        },
      ],
    },
  },
};

export const Failed: Story = {
  args: {
    snapshot: {
      ...runningSnapshot,
      mode: "fail",
      status: "FAILED",
      currentStage: "FAILED",
      errorMessage: "Template task failed on purpose.",
      events: [
        ...runningSnapshot.events,
        {
          taskId: runningSnapshot.id,
          seq: 4,
          eventType: "TASK_FAILED",
          stage: "FAILED",
          message: "Template task failed on purpose.",
          createdAt: new Date().toISOString(),
        },
      ],
    },
    transportState: "error",
  },
};
