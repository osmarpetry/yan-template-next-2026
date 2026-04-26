export const jobSources = [
  "we-work-remotely",
  "remotive",
  "hn-hiring",
  "landing-jobs",
  "greenhouse",
  "lever",
  "ashby",
] as const;

export type JobSource = (typeof jobSources)[number];

export const jobSourceLabels: Record<JobSource, string> = {
  "we-work-remotely": "We Work Remotely",
  remotive: "Remotive",
  "hn-hiring": "HN Hiring",
  "landing-jobs": "Landing.jobs",
  greenhouse: "Greenhouse",
  lever: "Lever",
  ashby: "Ashby",
};

export function getJobSourceLabel(source: JobSource) {
  return jobSourceLabels[source];
}

export interface Job {
  id: string;
  source: JobSource;
  title: string;
  company: string | null;
  location: string | null;
  publishedAt: string | null;
  url: string;
  description: string | null;
  tags?: string[];
}

export interface JobSourceStatus {
  source: JobSource;
  label: string;
  count: number;
  ok: boolean;
  error: string | null;
  warning: string | null;
  fetchedAt: string | null;
}

export interface JobsFeed {
  jobs: Job[];
  sources: JobSourceStatus[];
  fetchedAt: string;
}
