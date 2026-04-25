import type { TokenTree } from "./types";

export const rawTokens = {
  color: {
    parchment: {
      50: "#edf3f7",
      100: "#dde8ef",
      200: "#c3d3df",
    },
    slate: {
      200: "#9fb4c4",
      400: "#678398",
      800: "#213342",
      900: "#162431",
      950: "#0d1720",
    },
    moss: {
      300: "#6ea18c",
      500: "#2d647f",
      700: "#1f465c",
      800: "#173645",
    },
    ember: {
      400: "#c88943",
      500: "#a5662d",
      700: "#8a4639",
    },
    cobalt: {
      300: "#78c7f4",
      400: "#5da9d8",
    },
    paper: {
      50: "#fbfdfe",
      100: "#eff5f8",
    },
    ink: {
      700: "#4d6070",
      900: "#12202d",
    },
  },
  spacing: {
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    14: "3.5rem",
    18: "4.5rem",
  },
  radius: {
    sm: "16px",
    md: "24px",
    lg: "32px",
    pill: "999px",
  },
  shadow: {
    soft: "0 18px 36px rgba(17, 29, 40, 0.12)",
    panel: "0 28px 72px rgba(15, 28, 40, 0.14)",
    terminal: "0 28px 88px rgba(3, 8, 16, 0.42)",
  },
  motion: {
    fast: "160ms cubic-bezier(0.22, 1, 0.36, 1)",
    base: "240ms cubic-bezier(0.22, 1, 0.36, 1)",
    slow: "360ms cubic-bezier(0.22, 1, 0.36, 1)",
  },
  zIndex: {
    base: "1",
    overlay: "10",
    floating: "20",
  },
} satisfies TokenTree;
