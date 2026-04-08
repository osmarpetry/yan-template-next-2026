import type { TokenTree } from "./types";

export const rawTokens = {
  color: {
    parchment: {
      50: "#f7f0e1",
      100: "#efe4ca",
      200: "#ddc6a1",
    },
    slate: {
      200: "#97a7b6",
      400: "#6a7c8d",
      800: "#1b2532",
      900: "#121a24",
      950: "#0b1018",
    },
    moss: {
      300: "#8caf74",
      500: "#5f7b4c",
      700: "#314b2a",
      800: "#21321e",
    },
    ember: {
      400: "#d48a59",
      500: "#bf7041",
      700: "#8f4335",
    },
    cobalt: {
      300: "#87bfd4",
      400: "#6ea6d0",
    },
    paper: {
      50: "#fffaf0",
      100: "#fff5e7",
    },
    ink: {
      700: "#504733",
      900: "#20180e",
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
    soft: "0 18px 36px rgba(32, 24, 14, 0.12)",
    panel: "0 30px 72px rgba(40, 26, 16, 0.16)",
    terminal: "0 28px 88px rgba(3, 8, 16, 0.36)",
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
