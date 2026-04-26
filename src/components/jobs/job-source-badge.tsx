import { getJobSourceLabel, type JobSource } from "@/features/jobs/types";
import { cn } from "@/lib/shared/cn";

const badgeClasses: Record<JobSource, string> = {
  "we-work-remotely":
    "border-[rgba(36,95,125,0.18)] bg-[rgba(36,95,125,0.08)] text-[rgba(23,70,92,1)]",
  remotive:
    "border-[rgba(28,115,107,0.18)] bg-[rgba(28,115,107,0.08)] text-[rgba(19,84,78,1)]",
  "hn-hiring":
    "border-[rgba(176,121,58,0.18)] bg-[rgba(176,121,58,0.08)] text-[rgba(112,74,28,1)]",
  "landing-jobs":
    "border-[rgba(126,77,160,0.18)] bg-[rgba(126,77,160,0.08)] text-[rgba(84,44,112,1)]",
  greenhouse:
    "border-[rgba(61,118,64,0.18)] bg-[rgba(61,118,64,0.08)] text-[rgba(45,85,47,1)]",
  lever:
    "border-[rgba(0,111,145,0.18)] bg-[rgba(0,111,145,0.08)] text-[rgba(0,78,101,1)]",
  ashby:
    "border-[rgba(135,85,46,0.18)] bg-[rgba(135,85,46,0.08)] text-[rgba(95,58,28,1)]",
};

const dotClasses: Record<JobSource, string> = {
  "we-work-remotely": "bg-[rgba(36,95,125,1)]",
  remotive: "bg-[rgba(28,115,107,1)]",
  "hn-hiring": "bg-[rgba(176,121,58,1)]",
  "landing-jobs": "bg-[rgba(126,77,160,1)]",
  greenhouse: "bg-[rgba(61,118,64,1)]",
  lever: "bg-[rgba(0,111,145,1)]",
  ashby: "bg-[rgba(135,85,46,1)]",
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
