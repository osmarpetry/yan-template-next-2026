import { semanticTokenCatalog } from "@/design/tokens";

const colorTokenNames = new Set([
  "--color-surface-app",
  "--color-surface-panel",
  "--color-surface-panelStrong",
  "--color-surface-terminal",
  "--color-surface-terminalChrome",
  "--color-text-primary",
  "--color-text-secondary",
  "--color-text-inverse",
  "--color-border-subtle",
  "--color-border-strong",
  "--color-accent-brand",
  "--color-accent-brandStrong",
  "--color-accent-warm",
  "--color-accent-highlight",
  "--color-status-success",
  "--color-status-warning",
  "--color-status-danger",
  "--color-status-info",
]);

export function TokenDocs() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {semanticTokenCatalog.map((token) => {
        const isColor = colorTokenNames.has(token.cssVariable);

        return (
          <article
            key={token.cssVariable}
            className="rounded-card border border-border-subtle bg-surface-panel p-4 shadow-floating"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-secondary">
                  {token.group}
                </p>
                <h3 className="font-mono text-sm text-text-primary">
                  {token.cssVariable}
                </h3>
              </div>
              {isColor ? (
                <span
                  className="h-12 w-12 rounded-card border border-border-subtle"
                  style={{ background: `var(${token.cssVariable})` }}
                />
              ) : null}
            </div>
            <p className="font-mono text-xs text-text-secondary">{token.value}</p>
          </article>
        );
      })}
    </div>
  );
}
