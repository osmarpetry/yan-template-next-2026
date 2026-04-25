import { JobSourceBadge } from "@/components/jobs/job-source-badge";
import { type Job } from "@/features/jobs/types";

function formatPublishedDate(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(parsed);
}

interface JobsTableProps {
  jobs: readonly Job[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  return (
    <div className="overflow-hidden rounded-panel border border-border-subtle bg-surface-panel shadow-panel">
      <div className="max-h-[70dvh] overflow-auto">
        <table className="w-full min-w-[72rem] border-collapse text-left">
          <caption className="sr-only">Normalized remote jobs table</caption>
          <thead className="sticky top-0 z-10 bg-surface-panel-strong/95 backdrop-blur">
            <tr className="border-b border-border-subtle">
              <th className="px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-secondary">
                Job
              </th>
              <th className="px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-secondary">
                Source
              </th>
              <th className="px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-secondary">
                Location
              </th>
              <th className="px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-secondary">
                Published
              </th>
              <th className="px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-secondary">
                Listing
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-t border-border-subtle align-top transition-colors hover:bg-white/55"
              >
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <a
                        href={job.url}
                        rel="noreferrer"
                        target="_blank"
                        className="inline-flex max-w-[34rem] items-start gap-2 text-sm font-semibold text-text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-highlight"
                      >
                        <span>{job.title}</span>
                      </a>
                      <p className="text-sm text-text-secondary">
                        {job.company ?? "Company not listed"}
                      </p>
                    </div>
                    <p className="max-w-[44rem] text-sm leading-6 text-text-secondary">
                      {job.description ?? "No description snippet available."}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <JobSourceBadge source={job.source} />
                </td>
                <td className="px-4 py-4 text-sm text-text-primary">
                  {job.location ?? "Remote details not listed"}
                </td>
                <td className="px-4 py-4 text-sm text-text-primary">
                  {formatPublishedDate(job.publishedAt)}
                </td>
                <td className="px-4 py-4 text-sm">
                  <a
                    href={job.url}
                    rel="noreferrer"
                    target="_blank"
                    className="font-semibold text-accent-brand-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-highlight"
                    aria-label={`Open ${job.title} on ${job.company ?? "the source listing"}`}
                  >
                    Open listing
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
