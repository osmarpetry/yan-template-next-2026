import type { JobSource } from "@/features/jobs/types";

import { fetchAshbyJobs } from "./ashby";
import { fetchGreenhouseJobs } from "./greenhouse";
import { fetchHnHiringJobs } from "./hn-hiring";
import { fetchLandingJobs } from "./landing-jobs";
import { fetchLeverJobs } from "./lever";
import { fetchRemotiveJobs } from "./remotive";
import { createSourceResult, type JobSourceFetchResult } from "./shared";
import { fetchWeWorkRemotelyJobs } from "./we-work-remotely";

interface JobSourceFetcher {
  source: JobSource;
  fetchJobs: () => Promise<JobSourceFetchResult>;
}

export const jobSourceFetchers: ReadonlyArray<JobSourceFetcher> = [
  {
    source: "we-work-remotely",
    fetchJobs: async () => createSourceResult(await fetchWeWorkRemotelyJobs()),
  },
  {
    source: "remotive",
    fetchJobs: async () => createSourceResult(await fetchRemotiveJobs()),
  },
  {
    source: "hn-hiring",
    fetchJobs: async () => createSourceResult(await fetchHnHiringJobs()),
  },
  {
    source: "landing-jobs",
    fetchJobs: fetchLandingJobs,
  },
  {
    source: "greenhouse",
    fetchJobs: fetchGreenhouseJobs,
  },
  {
    source: "lever",
    fetchJobs: fetchLeverJobs,
  },
  {
    source: "ashby",
    fetchJobs: fetchAshbyJobs,
  },
];
