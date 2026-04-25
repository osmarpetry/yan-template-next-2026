import { z } from "zod";

import { createSnippet } from "@/features/jobs/utils/text";

import { fetchSourceJson, normalizeJob } from "./shared";

const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";

const remotiveResponseSchema = z.object({
  jobs: z.array(
    z.object({
      id: z.number(),
      url: z.string().url(),
      title: z.string().min(1),
      company_name: z.string().min(1),
      category: z.string().nullish(),
      tags: z.array(z.string()).optional(),
      job_type: z.string().nullish(),
      publication_date: z.string().nullish(),
      candidate_required_location: z.string().nullish(),
      description: z.string().nullish(),
    }),
  ),
});

export async function fetchRemotiveJobs() {
  const payload = remotiveResponseSchema.parse(
    await fetchSourceJson("remotive", REMOTIVE_URL),
  );

  return payload.jobs.map((job) =>
    normalizeJob({
      id: `remotive-${job.id}`,
      source: "remotive",
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location ?? null,
      publishedAt: job.publication_date ?? null,
      url: job.url,
      description: createSnippet(job.description, 300),
      tags: [job.category, job.job_type, ...(job.tags ?? [])].filter(
        Boolean,
      ) as string[],
    }),
  );
}
