import { z } from "zod";

import { createSnippet } from "@/features/jobs/utils/text";
import { fetchSourceJson, normalizeJob, type JobSourceFetchResult } from "@/features/jobs/sources/shared";
import { joinParts } from "@/features/jobs/sources/shared";

const LANDING_JOBS_URL = "https://landing.jobs/api/v1/jobs?limit=25";
const LANDING_COMPANIES_URL = "https://landing.jobs/api/v1/companies";

const landingJobSchema = z.object({
  id: z.number(),
  company_id: z.number().nullish(),
  title: z.string().min(1),
  url: z.string().url(),
  published_at: z.string().nullish(),
  remote: z.boolean().nullish(),
  relocation_paid: z.boolean().nullish(),
  role_description: z.string().nullish(),
  main_requirements: z.string().nullish(),
  nice_to_have: z.string().nullish(),
  perks: z.string().nullish(),
  type: z.string().nullish(),
  tags: z.array(z.string()).optional(),
  locations: z
    .array(
      z.object({
        city: z.string().nullish(),
        country_code: z.string().nullish(),
      }),
    )
    .optional(),
});

const landingCompanySchema = z.object({
  id: z.number(),
  name: z.string().nullish(),
});

const landingJobsResponseSchema = z.array(landingJobSchema);

function formatLandingLocation(
  locations: Array<{ city?: string | null; country_code?: string | null }> | undefined,
  isRemote: boolean,
) {
  const locationText = locations
    ?.map((location) => joinParts([location.city, location.country_code], ", "))
    .filter(Boolean)
    .join(" / ");

  if (isRemote && locationText) {
    return `Remote / ${locationText}`;
  }

  if (isRemote) {
    return "Remote";
  }

  return locationText || null;
}

function buildLandingDescription(job: z.infer<typeof landingJobSchema>) {
  return createSnippet(
    [
      job.role_description,
      job.main_requirements,
      job.nice_to_have,
      job.perks,
    ]
      .filter(Boolean)
      .join("\n\n"),
    320,
  );
}

function getCompanyFallback(url: string) {
  try {
    const pathSegments = new URL(url).pathname.split("/").filter(Boolean);
    const slug = pathSegments[pathSegments.indexOf("at") + 1];

    if (!slug) {
      return null;
    }

    return slug
      .split(/[-_]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  } catch {
    return null;
  }
}

async function fetchLandingCompanies(companyIds: readonly number[]) {
  const entries = await Promise.all(
    companyIds.map(async (companyId) => {
      try {
        const company = landingCompanySchema.parse(
          await fetchSourceJson(
            "landing-jobs",
            `${LANDING_COMPANIES_URL}/${companyId}`,
          ),
        );

        return [companyId, company.name ?? null] as const;
      } catch {
        return [companyId, null] as const;
      }
    }),
  );

  return new Map(entries);
}

export async function fetchLandingJobs(): Promise<JobSourceFetchResult> {
  const jobs = landingJobsResponseSchema.parse(
    await fetchSourceJson("landing-jobs", LANDING_JOBS_URL),
  );

  const companyIds = Array.from(
    new Set(
      jobs
        .map((job) => job.company_id)
        .filter((companyId): companyId is number => typeof companyId === "number"),
    ),
  );
  const companyNamesById = await fetchLandingCompanies(companyIds);

  return {
    jobs: jobs.map((job) =>
      normalizeJob({
        id: `landing-jobs-${job.id}`,
        source: "landing-jobs",
        title: job.title,
        company:
          (job.company_id ? companyNamesById.get(job.company_id) : null) ??
          getCompanyFallback(job.url),
        location: formatLandingLocation(job.locations, Boolean(job.remote)),
        publishedAt: job.published_at ?? null,
        url: job.url,
        description: buildLandingDescription(job),
        tags: [
          job.type,
          job.remote ? "Remote" : null,
          job.relocation_paid ? "Relocation paid" : null,
          ...(job.tags ?? []),
        ].filter(Boolean) as string[],
      }),
    ),
    warning: null,
  };
}
