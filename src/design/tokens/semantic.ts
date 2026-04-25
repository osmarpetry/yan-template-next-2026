import type { TokenTree } from "./types";

export const semanticTokens = {
  color: {
    surface: {
      app: "{color.parchment.50}",
      panel: "{color.paper.50}",
      panelStrong: "{color.paper.100}",
      terminal: "{color.slate.950}",
      terminalChrome: "rgba(11, 16, 24, 0.96)",
    },
    text: {
      primary: "{color.ink.900}",
      secondary: "rgba(18, 32, 45, 0.64)",
      inverse: "#eef4f8",
    },
    border: {
      subtle: "rgba(73, 103, 128, 0.16)",
      strong: "rgba(121, 161, 188, 0.22)",
    },
    accent: {
      brand: "{color.moss.500}",
      brandStrong: "{color.moss.700}",
      warm: "{color.ember.500}",
      highlight: "{color.cobalt.300}",
    },
    status: {
      success: "{color.moss.300}",
      warning: "{color.ember.400}",
      danger: "{color.ember.700}",
      info: "{color.cobalt.400}",
    },
  },
  effect: {
    shadow: {
      panel: "{shadow.panel}",
      floating: "{shadow.soft}",
      terminal: "{shadow.terminal}",
    },
  },
  radius: {
    panel: "{radius.lg}",
    card: "{radius.md}",
    button: "{radius.md}",
    pill: "{radius.pill}",
  },
  font: {
    display: 'var(--font-family-display), "Arial Black", sans-serif',
    body: 'var(--font-family-body), system-ui, sans-serif',
    mono: 'var(--font-family-mono), "SFMono-Regular", ui-monospace, monospace',
  },
  motion: {
    base: "{motion.base}",
    slow: "{motion.slow}",
  },
  layout: {
    content: "min(100%, 1480px)",
    gutter: "clamp(20px, 4vw, 40px)",
    hero: "clamp(560px, 78dvh, 840px)",
  },
} satisfies TokenTree;
