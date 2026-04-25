import type { Job, JobSource } from "@/features/jobs/types";

import { fetchHnHiringJobs } from "./hn-hiring";
import { fetchRemotiveJobs } from "./remotive";
import { fetchWeWorkRemotelyJobs } from "./we-work-remotely";

interface JobSourceFetcher {
  source: JobSource;
  fetchJobs: () => Promise<Job[]>;
}

export const jobSourceFetchers: ReadonlyArray<JobSourceFetcher> = [
  {
    source: "we-work-remotely",
    fetchJobs: fetchWeWorkRemotelyJobs,
  },
  {
    source: "remotive",
    fetchJobs: fetchRemotiveJobs,
  },
  {
    source: "hn-hiring",
    fetchJobs: fetchHnHiringJobs,
  },
];
