import { z } from "zod";

import { ashbyBoards } from "@/features/jobs/sources/ats-company-boards";
import {
  fetchSourceJson,
  joinParts,
  normalizeJob,
  summarizeBoardFailures,
  type JobSourceFetchResult,
} from "@/features/jobs/sources/shared";
import { createSnippet } from "@/features/jobs/utils/text";

const ASHBY_URL = "https://jobs.ashbyhq.com/api/non-user-graphql";

const ASHBY_BOARD_QUERY = `
  query ApiJobBoard($organizationHostedJobsPageName: String!) {
    jobBoard: jobBoardWithTeams(
      organizationHostedJobsPageName: $organizationHostedJobsPageName
    ) {
      teams {
        id
        name
        externalName
        parentTeamId
      }
      jobPostings {
        id
        title
        locationName
        locationId
        teamId
        workplaceType
        employmentType
        compensationTierSummary
        secondaryLocations {
          locationName
          locationId
        }
      }
    }
  }
`;

const ashbyTeamSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  externalName: z.string().nullish(),
  parentTeamId: z.string().nullish(),
});

const ashbyJobPostingSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  locationName: z.string().nullish(),
  locationId: z.string().nullish(),
  teamId: z.string().nullish(),
  workplaceType: z.string().nullish(),
  employmentType: z.string().nullish(),
  compensationTierSummary: z.string().nullish(),
  secondaryLocations: z
    .array(
      z.object({
        locationName: z.string().nullish(),
        locationId: z.string().nullish(),
      }),
    )
    .default([]),
});

type AshbyJobPosting = z.infer<typeof ashbyJobPostingSchema>;

const ashbyBoardResponseSchema = z.object({
  data: z.object({
    jobBoard: z
      .object({
        teams: z.array(ashbyTeamSchema).default([]),
        jobPostings: z.array(ashbyJobPostingSchema).default([]),
      })
      .nullable(),
  }),
});

function buildAshbyJobUrl(token: string, postingId: string) {
  return `https://jobs.ashbyhq.com/${token}/${postingId}`;
}

function buildAshbyDescription(
  teamName: string | null,
  job: AshbyJobPosting,
) {
  return createSnippet(
    [
      teamName ? `Team: ${teamName}` : null,
      job.workplaceType ? `Workplace: ${job.workplaceType}` : null,
      job.employmentType ? `Employment: ${job.employmentType}` : null,
      job.compensationTierSummary
        ? `Compensation: ${job.compensationTierSummary}`
        : null,
      job.secondaryLocations.length > 0
        ? `Secondary locations: ${job.secondaryLocations
            .map((location) => location.locationName)
            .filter(Boolean)
            .join(" / ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
    320,
  );
}

export async function fetchAshbyJobs(): Promise<JobSourceFetchResult> {
  const settledBoards = await Promise.all(
    ashbyBoards.map(async (board) => {
      try {
        const payload = ashbyBoardResponseSchema.parse(
          await fetchSourceJson("ashby", ASHBY_URL, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              operationName: "ApiJobBoard",
              variables: {
                organizationHostedJobsPageName: board.token,
              },
              query: ASHBY_BOARD_QUERY,
            }),
          }),
        );

        if (!payload.data.jobBoard) {
          throw new Error(`No public Ashby board data returned for ${board.company}.`);
        }

        const teamNamesById = new Map(
          payload.data.jobBoard.teams.map((team) => [
            team.id,
            team.externalName ?? team.name ?? null,
          ]),
        );

        return {
          ok: true as const,
          company: board.company,
          jobs: payload.data.jobBoard.jobPostings.map((job) => {
            const teamName = job.teamId ? teamNamesById.get(job.teamId) ?? null : null;
            const secondaryLocations = job.secondaryLocations
              .map((location) => location.locationName)
              .filter(Boolean)
              .join(" / ");

            return normalizeJob({
              id: `ashby-${board.token}-${job.id}`,
              source: "ashby",
              title: job.title,
              company: board.company,
              location:
                joinParts([job.locationName, secondaryLocations], " · ") || null,
              publishedAt: null,
              url: buildAshbyJobUrl(board.token, job.id),
              description: buildAshbyDescription(teamName, job),
              tags: [
                teamName,
                job.workplaceType,
                job.employmentType,
                job.compensationTierSummary,
              ].filter(Boolean) as string[],
            });
          }),
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
      `No configured Ashby boards could be loaded. ${summarizeBoardFailures(failures)}`,
    );
  }

  return {
    jobs,
    warning: summarizeBoardFailures(failures),
  };
}
