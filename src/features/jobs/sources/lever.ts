import { z } from "zod";

import { leverBoards } from "@/features/jobs/sources/ats-company-boards";
import {
  fetchSourceJson,
  joinParts,
  normalizeJob,
  summarizeBoardFailures,
  toIsoString,
  type JobSourceFetchResult,
} from "@/features/jobs/sources/shared";
import { createSnippet } from "@/features/jobs/utils/text";

const leverPostingSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  hostedUrl: z.string().url().nullish(),
  applyUrl: z.string().url().nullish(),
  createdAt: z.number().nullish(),
  workplaceType: z.string().nullish(),
  country: z.string().nullish(),
  openingPlain: z.string().nullish(),
  descriptionPlain: z.string().nullish(),
  additionalPlain: z.string().nullish(),
  salaryDescriptionPlain: z.string().nullish(),
  categories: z
    .object({
      commitment: z.string().nullish(),
      department: z.string().nullish(),
      location: z.string().nullish(),
      team: z.string().nullish(),
      allLocations: z.array(z.string()).optional(),
    })
    .nullish(),
  lists: z
    .array(
      z.object({
        text: z.string().nullish(),
        content: z.string().nullish(),
      }),
    )
    .optional(),
});

const leverBoardResponseSchema = z.array(leverPostingSchema);

function getLeverBoardUrl(token: string) {
  return `https://api.lever.co/v0/postings/${token}?mode=json`;
}

function buildLeverDescription(job: z.infer<typeof leverPostingSchema>) {
  const listContent =
    job.lists
      ?.map((entry) => joinParts([entry.text, entry.content], "\n"))
      .filter(Boolean)
      .join("\n\n") ?? "";

  return createSnippet(
    [
      job.descriptionPlain,
      job.openingPlain,
      listContent,
      job.additionalPlain,
      job.salaryDescriptionPlain,
    ]
      .filter(Boolean)
      .join("\n\n"),
    320,
  );
}

function buildLeverLocation(job: z.infer<typeof leverPostingSchema>) {
  return joinParts(
    [
      job.categories?.location,
      job.categories?.allLocations?.length ? job.categories.allLocations.join(" / ") : null,
      job.country,
    ],
    " · ",
  ) || null;
}

export async function fetchLeverJobs(): Promise<JobSourceFetchResult> {
  const settledBoards = await Promise.all(
    leverBoards.map(async (board) => {
      try {
        const payload = leverBoardResponseSchema.parse(
          await fetchSourceJson("lever", getLeverBoardUrl(board.token)),
        );

        return {
          ok: true as const,
          company: board.company,
          jobs: payload.map((job) =>
            normalizeJob({
              id: `lever-${board.token}-${job.id}`,
              source: "lever",
              title: job.text,
              company: board.company,
              location: buildLeverLocation(job),
              publishedAt: toIsoString(job.createdAt),
              url: job.hostedUrl ?? job.applyUrl ?? board.careersUrl ?? "https://jobs.lever.co",
              description: buildLeverDescription(job),
              tags: [
                job.categories?.department,
                job.categories?.team,
                job.categories?.commitment,
                job.workplaceType,
              ].filter(Boolean) as string[],
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
      `No configured Lever boards could be loaded. ${summarizeBoardFailures(failures)}`,
    );
  }

  return {
    jobs,
    warning: summarizeBoardFailures(failures),
  };
}
