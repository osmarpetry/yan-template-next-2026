import { getJobSourceLabel, type JobSource } from "@/features/jobs/types";
import { cn } from "@/lib/shared/cn";

const badgeClasses: Record<JobSource, string> = {
  "we-work-remotely":
    "border-[rgba(36,95,125,0.18)] bg-[rgba(36,95,125,0.08)] text-[rgba(23,70,92,1)]",
  remotive:
    "border-[rgba(28,115,107,0.18)] bg-[rgba(28,115,107,0.08)] text-[rgba(19,84,78,1)]",
  "hn-hiring":
    "border-[rgba(176,121,58,0.18)] bg-[rgba(176,121,58,0.08)] text-[rgba(112,74,28,1)]",
};

const dotClasses: Record<JobSource, string> = {
  "we-work-remotely": "bg-[rgba(36,95,125,1)]",
  remotive: "bg-[rgba(28,115,107,1)]",
  "hn-hiring": "bg-[rgba(176,121,58,1)]",
};

interface JobSourceBadgeProps {
  source: JobSource;
}

export function JobSourceBadge({ source }: JobSourceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em]",
        badgeClasses[source],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[source])} />
      {getJobSourceLabel(source)}
    </span>
  );
}
