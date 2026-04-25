"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

interface JobsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function JobsError({ error, reset }: JobsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="site-canvas px-4 py-5 md:px-7 md:py-7">
      <div className="mx-auto flex w-full max-w-[var(--layout-content)] flex-col gap-5">
        <header className="rounded-panel border border-white/10 bg-surface-terminal-chrome/82 px-5 py-5 text-text-inverse shadow-floating backdrop-blur md:px-7 md:py-7">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-white/58">
            find-remote-for-me
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl leading-none text-white md:text-5xl">
            Raw remote jobs, one operator dashboard.
          </h1>
        </header>

        <Panel padding="comfy" tone="paper" role="alert">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
            Unexpected route failure
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-text-primary">
            The jobs dashboard could not finish rendering.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            This is different from a source-specific feed error. The route hit an
            unexpected application failure before it could return the dashboard.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => reset()}>Retry jobs route</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
