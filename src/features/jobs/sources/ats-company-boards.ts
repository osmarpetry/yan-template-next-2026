export type AtsBoardProvider = "greenhouse" | "lever" | "ashby";

export interface AtsBoardConfig {
  company: string;
  provider: AtsBoardProvider;
  token: string;
  careersUrl?: string;
  notes?: string;
}

export const greenhouseBoards: ReadonlyArray<AtsBoardConfig> = [
  {
    company: "Vercel",
    provider: "greenhouse",
    token: "vercel",
    careersUrl: "https://job-boards.greenhouse.io/vercel",
    notes: "Frontend platform and developer tooling.",
  },
  {
    company: "GitLab",
    provider: "greenhouse",
    token: "gitlab",
    careersUrl: "https://job-boards.greenhouse.io/gitlab",
    notes: "Remote-friendly DevOps and SaaS engineering roles.",
  },
  {
    company: "Cloudflare",
    provider: "greenhouse",
    token: "cloudflare",
    careersUrl: "https://job-boards.greenhouse.io/cloudflare",
    notes: "Infrastructure and cybersecurity adjacent roles.",
  },
];

export const leverBoards: ReadonlyArray<AtsBoardConfig> = [
  {
    company: "Plaid",
    provider: "lever",
    token: "plaid",
    careersUrl: "https://jobs.lever.co/plaid",
    notes: "API-heavy fintech engineering roles with Europe presence.",
  },
];

export const ashbyBoards: ReadonlyArray<AtsBoardConfig> = [
  {
    company: "PostHog",
    provider: "ashby",
    token: "posthog",
    careersUrl: "https://jobs.ashbyhq.com/posthog",
    notes: "Remote product analytics company with engineering-heavy hiring.",
  },
  {
    company: "Linear",
    provider: "ashby",
    token: "linear",
    careersUrl: "https://jobs.ashbyhq.com/linear",
    notes: "Product and engineering roles with remote-friendly patterns.",
  },
];

export const atsCompanyBoards: ReadonlyArray<AtsBoardConfig> = [
  ...greenhouseBoards,
  ...leverBoards,
  ...ashbyBoards,
];
