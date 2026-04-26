"use client";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  getJobSearchPresetByQuery,
  jobSearchPresets,
} from "@/features/jobs/search-presets";
import { type JobSource } from "@/features/jobs/types";

import { SourceFilterMenu } from "./source-filter-menu";

interface JobsToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  selectedSources: readonly JobSource[];
  onSelectedSourcesChange: (sources: JobSource[]) => void;
  visibleCount: number;
  totalCount: number;
  fetchedAtLabel: string;
  isRefreshingSearch: boolean;
}

export function JobsToolbar({
  query,
  onQueryChange,
  selectedSources,
  onSelectedSourcesChange,
  visibleCount,
  totalCount,
  fetchedAtLabel,
  isRefreshingSearch,
}: JobsToolbarProps) {
  const activePreset = getJobSearchPresetByQuery(query);

  return (
    <Panel
      className="grid gap-4 border-border-subtle/80 bg-surface-panel/95 backdrop-blur md:grid-cols-[minmax(0,1fr)_auto]"
      padding="dense"
      tone="paper"
    >
      <div className="space-y-3">
        <label
          className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary"
          htmlFor="jobs-search"
        >
          Search visible jobs
        </label>
        <input
          id="jobs-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder='react typescript | "remote us"'
          className="w-full rounded-card border border-border-subtle bg-white/85 px-4 py-3 text-sm text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition focus-visible:border-accent-brand focus-visible:ring-2 focus-visible:ring-accent-highlight"
        />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {jobSearchPresets.map((preset) => {
              const isActive = activePreset?.id === preset.id;

              return (
                <Button
                  key={preset.id}
                  aria-pressed={isActive}
                  size="sm"
                  tone={isActive ? "primary" : "secondary"}
                  className="px-3"
                  onClick={() =>
                    onQueryChange(isActive ? "" : preset.query)
                  }
                  title={preset.query}
                >
                  {preset.label}
                </Button>
              );
            })}
          </div>
          <p className="text-xs leading-5 text-text-secondary">
            Quick presets for first-pass triage. Use quotes for phrases and{" "}
            <span className="font-mono text-[0.72rem] text-text-primary">|</span>{" "}
            for OR groups.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:items-end md:justify-end">
        <SourceFilterMenu
          selectedSources={selectedSources}
          onChange={onSelectedSourcesChange}
        />
        <p aria-live="polite" className="text-sm text-text-secondary">
          Showing{" "}
          <span className="font-semibold text-text-primary">{visibleCount}</span> of{" "}
          <span className="font-semibold text-text-primary">{totalCount}</span> jobs.
          {" "}
          Last fetched {fetchedAtLabel}.
          {isRefreshingSearch ? " Updating search…" : ""}
        </p>
      </div>
    </Panel>
  );
}
