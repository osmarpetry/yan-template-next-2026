import { getJobSourceLabel, type Job, type JobSource } from "@/features/jobs/types";
import { normalizeText } from "@/features/jobs/utils/text";

interface JobFilters {
  query: string;
  enabledSources: readonly JobSource[];
}

function buildSearchText(job: Job) {
  return normalizeText(
    [
      job.title,
      job.company,
      job.location,
      getJobSourceLabel(job.source),
      job.description,
      job.tags?.join(" "),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function filterJobs(jobs: readonly Job[], filters: JobFilters) {
  const enabledSources = new Set(filters.enabledSources);
  const query = normalizeText(filters.query);

  return jobs.filter((job) => {
    if (!enabledSources.has(job.source)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return buildSearchText(job).includes(query);
  });
}
