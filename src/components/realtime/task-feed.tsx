import { buildTaskLines, transportStateLabel } from "@/lib/shared/task-feed";
import { taskStatusLabel, type TaskSnapshot, type TransportState } from "@/lib/shared/tasks";

const toneClasses = {
  default: "text-white/82",
  success: "text-status-success",
  warning: "text-status-warning",
  danger: "text-status-danger",
  info: "text-accent-highlight",
} as const;

interface TaskFeedProps {
  snapshot: TaskSnapshot | null;
  transportState: TransportState;
}

export function TaskFeed({ snapshot, transportState }: TaskFeedProps) {
  const lines = buildTaskLines(snapshot);

  return (
    <div className="relative flex min-h-[540px] flex-col overflow-hidden rounded-panel border border-border-strong terminal-surface shadow-terminal">
      <div className="terminal-topbar flex items-center justify-between border-b border-white/8 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-status-danger" />
          <span className="h-3 w-3 rounded-full bg-status-warning" />
          <span className="h-3 w-3 rounded-full bg-status-success" />
        </div>
        <div className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-white/48">
          live task stream
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/8 px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-white/58">
        <span>{transportStateLabel(transportState)}</span>
        {snapshot ? <span>{taskStatusLabel(snapshot.status)}</span> : null}
        {snapshot?.currentStage ? <span>{snapshot.currentStage}</span> : null}
      </div>

      <div
        className="relative flex-1 overflow-auto px-5 py-4 font-mono text-sm"
        data-testid="task-feed"
      >
        <div className="space-y-3">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`flex gap-3 ${toneClasses[line.tone]}`}
              data-testid="task-line"
            >
              <span className="w-20 shrink-0 text-white/38">{line.prefix}</span>
              <span className="min-w-0 flex-1">{line.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
