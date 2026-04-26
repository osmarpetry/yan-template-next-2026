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

function parseQueryGroups(query: string) {
  return query
    .split("|")
    .map((group) =>
      [...group.matchAll(/"([^"]+)"|(\S+)/g)]
        .map((match) => normalizeText(match[1] ?? match[2] ?? ""))
        .filter(Boolean),
    )
    .filter((group) => group.length > 0);
}

function containsSearchTerm(searchText: string, term: string) {
  const haystack = ` ${searchText} `;
  const needle = ` ${term} `;

  return haystack.includes(needle);
}

export function filterJobs(jobs: readonly Job[], filters: JobFilters) {
  const enabledSources = new Set(filters.enabledSources);
  const queryGroups = parseQueryGroups(filters.query);

  return jobs.filter((job) => {
    if (!enabledSources.has(job.source)) {
      return false;
    }

    if (queryGroups.length === 0) {
      return true;
    }

    const searchText = buildSearchText(job);

    return queryGroups.some((group) =>
      group.every((term) => containsSearchTerm(searchText, term)),
    );
  });
}
