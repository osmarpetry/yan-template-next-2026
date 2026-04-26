export interface JobSearchPreset {
  id: string;
  label: string;
  query: string;
}

export const jobSearchPresets: ReadonlyArray<JobSearchPreset> = [
  {
    id: "frontend-core",
    label: "Frontend core",
    query: 'frontend | react | "design systems" | next js',
  },
  {
    id: "full-stack",
    label: "Full-stack",
    query: '"full stack" | react node | "product engineering"',
  },
  {
    id: "platform-infra",
    label: "Platform / infra",
    query: 'platform | infrastructure | devops | "ci cd" | sre',
  },
  {
    id: "europe-emea",
    label: "Europe / EMEA",
    query: '"remote europe" | emea | europe | uk | pt',
  },
] as const;

export function getJobSearchPresetByQuery(query: string) {
  const normalized = query.trim();

  return jobSearchPresets.find((preset) => preset.query === normalized) ?? null;
}
