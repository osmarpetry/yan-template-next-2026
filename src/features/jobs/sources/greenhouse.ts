import { z } from "zod";

import { greenhouseBoards } from "@/features/jobs/sources/ats-company-boards";
import {
  fetchSourceJson,
  normalizeJob,
  summarizeBoardFailures,
  toIsoString,
  type JobSourceFetchResult,
} from "@/features/jobs/sources/shared";
import { createSnippet } from "@/features/jobs/utils/text";

const greenhouseBoardResponseSchema = z.object({
  jobs: z.array(
    z.object({
      id: z.number(),
      absolute_url: z.string().url(),
      title: z.string().min(1),
      company_name: z.string().nullish(),
      content: z.string().nullish(),
      updated_at: z.string().nullish(),
      first_published: z.string().nullish(),
      location: z
        .object({
          name: z.string().nullish(),
        })
        .nullish(),
      departments: z
        .array(
          z.object({
            name: z.string().nullish(),
          }),
        )
        .optional(),
      offices: z
        .array(
          z.object({
            name: z.string().nullish(),
            location: z.string().nullish(),
          }),
        )
        .optional(),
    }),
  ),
});

function getGreenhouseBoardUrl(token: string) {
  return `https://boards-api.greenhouse.io/v1/boards/${token}/jobs?content=true`;
}

function buildGreenhouseLocation(
  location: { name?: string | null } | null | undefined,
  offices:
    | Array<{
        name?: string | null;
        location?: string | null;
      }>
    | undefined,
) {
  if (location?.name?.trim()) {
    return location.name.trim();
  }

  const office = offices?.find((entry) => entry.location || entry.name);
  return office?.location?.trim() || office?.name?.trim() || null;
}

function collectGreenhouseTags(
  departments: Array<{ name?: string | null }> | undefined,
  offices: Array<{ name?: string | null; location?: string | null }> | undefined,
) {
  return [
    ...(departments?.map((department) => department.name).filter(Boolean) ?? []),
    ...(offices?.flatMap((office) => [office.name, office.location]).filter(Boolean) ??
      []),
  ] as string[];
}

export async function fetchGreenhouseJobs(): Promise<JobSourceFetchResult> {
  const settledBoards = await Promise.all(
    greenhouseBoards.map(async (board) => {
      try {
        const payload = greenhouseBoardResponseSchema.parse(
          await fetchSourceJson("greenhouse", getGreenhouseBoardUrl(board.token)),
        );

        return {
          ok: true as const,
          company: board.company,
          jobs: payload.jobs.map((job) =>
            normalizeJob({
              id: `greenhouse-${board.token}-${job.id}`,
              source: "greenhouse",
              title: job.title,
              company: job.company_name ?? board.company,
              location: buildGreenhouseLocation(job.location, job.offices),
              publishedAt: toIsoString(job.first_published ?? job.updated_at),
              url: job.absolute_url,
              description: createSnippet(job.content, 320),
              tags: collectGreenhouseTags(job.departments, job.offices),
            }),
          ),
        };
      } catch (error) {
        return {
          ok: false as const,
          company: board.company,
          reason: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
  );

  const jobs = settledBoards.flatMap((entry) => (entry.ok ? entry.jobs : []));
  const failures = settledBoards
    .filter((entry) => !entry.ok)
    .map((entry) => ({
      company: entry.company,
      reason: entry.reason,
    }));

  if (jobs.length === 0 && failures.length > 0) {
    throw new Error(
      `No configured Greenhouse boards could be loaded. ${summarizeBoardFailures(failures)}`,
    );
  }

  return {
    jobs,
    warning: summarizeBoardFailures(failures),
  };
}
