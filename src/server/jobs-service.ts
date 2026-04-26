import { jobSourceFetchers } from "@/features/jobs/sources";
import { getJobSourceLabel, type Job, type JobSourceStatus, type JobsFeed } from "@/features/jobs/types";
import { formatSourceError } from "@/features/jobs/sources/shared";

function sortJobsByRecency(jobs: Job[]) {
  return [...jobs].sort((left, right) => {
    const leftDate = left.publishedAt ?? "";
    const rightDate = right.publishedAt ?? "";

    if (leftDate !== rightDate) {
      return leftDate < rightDate ? 1 : -1;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getJobsFeed(): Promise<JobsFeed> {
  const fetchedAt = new Date().toISOString();
  const results = await Promise.allSettled(
    jobSourceFetchers.map(async (entry) => ({
      source: entry.source,
      result: await entry.fetchJobs(),
    })),
  );

  const sources: JobSourceStatus[] = results.map((result, index) => {
    const source = jobSourceFetchers[index].source;

    if (result.status === "fulfilled") {
      return {
        source,
        label: getJobSourceLabel(source),
        count: result.value.result.jobs.length,
        ok: true,
        error: null,
        warning: result.value.result.warning,
        fetchedAt,
      };
    }

    return {
      source,
      label: getJobSourceLabel(source),
      count: 0,
      ok: false,
      error: formatSourceError(source, result.reason),
      warning: null,
      fetchedAt: null,
    };
  });

  const jobs = sortJobsByRecency(
    results.flatMap((result) =>
      result.status === "fulfilled" ? result.value.result.jobs : [],
    ),
  );

  return {
    jobs,
    sources,
    fetchedAt,
  };
}
