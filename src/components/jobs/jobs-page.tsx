"use client";

import { startTransition, useDeferredValue, useState } from "react";

import { JobsTable } from "@/components/jobs/jobs-table";
import { JobsToolbar } from "@/components/jobs/jobs-toolbar";
import { JobSourceBadge } from "@/components/jobs/job-source-badge";
import { Panel } from "@/components/ui/panel";
import { filterJobs } from "@/features/jobs/utils/filter-jobs";
import { jobSources, type JobSource, type JobSourceStatus, type JobsFeed } from "@/features/jobs/types";

interface JobsPageProps {
  feed: JobsFeed;
}

function formatTimestamp(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function MetricCard({
  detail,
  title,
  value,
}: {
  detail: string;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-card border border-white/10 bg-white/6 px-4 py-4">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/56">
        {title}
      </p>
      <p className="mt-3 font-display text-3xl leading-none text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/66">{detail}</p>
    </div>
  );
}

function SourceStatusCard({ status }: { status: JobSourceStatus }) {
  const stateLabel = !status.ok
    ? "Issue"
    : status.warning
      ? "Partial"
      : "Loaded";

  const stateClassName = !status.ok || status.warning
    ? "text-status-warning"
    : "text-status-success";

  return (
    <Panel className="h-full" padding="dense" tone="paper">
      <div className="flex items-start justify-between gap-3">
        <JobSourceBadge source={status.source} />
        <span className={`font-mono text-[0.68rem] uppercase tracking-[0.18em] ${stateClassName}`}>
          {stateLabel}
        </span>
      </div>
      <p className="mt-4 font-display text-3xl leading-none text-text-primary">
        {status.count}
      </p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {!status.ok
          ? status.error ?? `${status.label} could not be loaded.`
          : status.warning
            ? `${status.count} jobs available from ${status.label} in this session. ${status.warning}`
            : `${status.count} jobs available from ${status.label} in this session.`}
      </p>
    </Panel>
  );
}

export function JobsPage({ feed }: JobsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedSources, setSelectedSources] = useState<JobSource[]>([
    ...jobSources,
  ]);

  const deferredQuery = useDeferredValue(query);
  const visibleJobs = filterJobs(feed.jobs, {
    query: deferredQuery,
    enabledSources: selectedSources,
  });

  const sourceErrors = feed.sources.filter((source) => !source.ok);
  const sourceWarnings = feed.sources.filter((source) => source.ok && source.warning);
  const hasSuccessfulSource = feed.sources.some((source) => source.ok);
  const isRefreshingSearch = query !== deferredQuery;

  return (
    <div className="site-canvas px-4 py-5 md:px-7 md:py-7">
      <div className="mx-auto flex w-full max-w-[var(--layout-content)] flex-col gap-5">
        <header className="rounded-panel border border-white/10 bg-surface-terminal-chrome/82 px-5 py-5 text-text-inverse shadow-floating backdrop-blur md:px-7 md:py-7">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.9fr)]">
            <div className="space-y-4">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-white/58">
                find-remote-for-me
              </p>
              <div className="space-y-3">
                <h1 className="max-w-3xl font-display text-3xl leading-none text-white md:text-5xl">
                  Raw remote jobs, one operator dashboard.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                  First raw feed view for reviewing public remote boards and
                  selected ATS company boards without opening every source
                  manually. This slice fetches, normalizes, and filters jobs,
                  but it does not classify eligibility yet.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <MetricCard
                detail="Combined rows from successful sources"
                title="Loaded jobs"
                value={`${feed.jobs.length}`}
              />
              <MetricCard
                detail="Enabled source filters for the current review"
                title="Active sources"
                value={`${selectedSources.length}/${jobSources.length}`}
              />
              <MetricCard
                detail={formatTimestamp(feed.fetchedAt)}
                title="Visible now"
                value={`${visibleJobs.length}`}
              />
            </div>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          {feed.sources.map((status) => (
            <SourceStatusCard key={status.source} status={status} />
          ))}
        </div>

        <JobsToolbar
          fetchedAtLabel={formatTimestamp(feed.fetchedAt)}
          isRefreshingSearch={isRefreshingSearch}
          onQueryChange={setQuery}
          onSelectedSourcesChange={(nextSources) => {
            startTransition(() => {
              setSelectedSources(nextSources);
            });
          }}
          query={query}
          selectedSources={selectedSources}
          totalCount={feed.jobs.length}
          visibleCount={visibleJobs.length}
        />

        {(sourceErrors.length > 0 || sourceWarnings.length > 0) && hasSuccessfulSource ? (
          <Panel padding="dense" tone="subtle" role="status">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
              Source issues
            </p>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              Some feeds or company boards had issues, but successful jobs are
              still visible in the table below.
            </p>
            <ul className="mt-3 space-y-1 text-sm leading-6 text-text-secondary">
              {sourceWarnings.map((source) => (
                <li key={`${source.source}-warning`}>
                  {source.label}: {source.warning}
                </li>
              ))}
              {sourceErrors.map((source) => (
                <li key={source.source}>
                  {source.label}: {source.error}
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}

        {!hasSuccessfulSource ? (
          <Panel padding="comfy" tone="paper" role="alert">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
              Feed unavailable
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-text-primary">
              No source could be loaded for this session.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
              The dashboard itself is working, but the live sources did not
              return usable data. Check the source status cards above and retry
              the page later.
            </p>
          </Panel>
        ) : visibleJobs.length === 0 ? (
          <Panel padding="comfy" tone="paper" role="status">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
              No visible jobs
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-text-primary">
              Nothing matches the current search and source filters.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
              Try widening the source selection or clearing the keyword search
              to bring rows back into view.
            </p>
          </Panel>
        ) : (
          <JobsTable jobs={visibleJobs} />
        )}
      </div>
    </div>
  );
}
