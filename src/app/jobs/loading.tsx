import { Panel } from "@/components/ui/panel";

export default function JobsLoading() {
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
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
            Loading the first raw job feed view and normalizing the source data.
          </p>
        </header>

        <Panel padding="comfy" tone="paper" role="status">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-text-secondary">
            Loading sources
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-text-primary">
            Fetching We Work Remotely, Remotive, and HN Hiring.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            This route fetches live source data on the server before rendering
            the dashboard.
          </p>
        </Panel>
      </div>
    </div>
  );
}
