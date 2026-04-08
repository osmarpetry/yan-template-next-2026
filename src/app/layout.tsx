import type { Metadata } from "next";
import { Archivo_Black, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-family-display",
  weight: "400",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-family-body",
  weight: ["400", "500", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-family-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "yan-template-next-2026",
  description:
    "Reusable Next.js starter with Tailwind design tokens, Storybook, Vitest, Playwright BDD, and Socket.IO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full font-body text-text-primary">{children}</body>
    </html>
  );
}
