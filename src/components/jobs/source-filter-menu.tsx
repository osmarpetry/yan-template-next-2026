"use client";

import * as Ariakit from "@ariakit/react";

import { buttonVariants } from "@/components/ui/button";
import { getJobSourceLabel, jobSources, type JobSource } from "@/features/jobs/types";
import { cn } from "@/lib/shared/cn";

interface SourceFilterMenuProps {
  selectedSources: readonly JobSource[];
  onChange: (sources: JobSource[]) => void;
}

interface SourceMenuValues {
  [key: string]: string[];
  sources: JobSource[];
}

export function getSourceMenuLabel(selectedSources: readonly JobSource[]) {
  if (selectedSources.length === 0) {
    return "No sources";
  }

  if (selectedSources.length === jobSources.length) {
    return "All sources";
  }

  if (selectedSources.length === 1) {
    return `${getJobSourceLabel(selectedSources[0])} only`;
  }

  return `${selectedSources.length} sources`;
}

export function SourceFilterMenu({
  selectedSources,
  onChange,
}: SourceFilterMenuProps) {
  const values: SourceMenuValues = {
    sources: [...selectedSources],
  };

  return (
    <Ariakit.MenuProvider
      values={values}
      setValues={(next) => {
        const sourceValues = Array.isArray(next.sources) ? next.sources : [];
        const orderedSources = jobSources.filter((source) =>
          sourceValues.includes(source),
        );
        onChange([...orderedSources]);
      }}
    >
      <Ariakit.MenuButton
        aria-label="Filter jobs by source"
        className={cn(
          buttonVariants({ size: "md", tone: "secondary" }),
          "w-full justify-between gap-3 md:w-auto",
        )}
      >
        <span>{getSourceMenuLabel(selectedSources)}</span>
        <span aria-hidden="true" className="font-mono text-xs text-text-secondary">
          v
        </span>
      </Ariakit.MenuButton>

      <Ariakit.Menu
        gutter={10}
        className="z-30 min-w-[18rem] rounded-panel border border-border-subtle bg-surface-panel p-2 shadow-floating"
      >
        {jobSources.map((source) => (
          <Ariakit.MenuItemCheckbox
            key={source}
            hideOnClick={false}
            name="sources"
            value={source}
            className="flex cursor-default items-center justify-between gap-3 rounded-card px-3 py-2 text-sm text-text-primary outline-none transition-colors hover:bg-surface-panel-strong focus-visible:ring-2 focus-visible:ring-accent-highlight"
          >
            <span className="flex items-center gap-3">
              <Ariakit.MenuItemCheck className="inline-flex h-4 w-4 items-center justify-center text-accent-brand" />
              <span>{getJobSourceLabel(source)}</span>
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-secondary">
              {selectedSources.includes(source) ? "On" : "Off"}
            </span>
          </Ariakit.MenuItemCheckbox>
        ))}
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
