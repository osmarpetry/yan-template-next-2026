import { createHash } from "node:crypto";

import { getJobSourceLabel, type Job, type JobSource } from "@/features/jobs/types";

const REQUEST_HEADERS = {
  "user-agent": "find-remote-for-me/0.1 (+private operator dashboard)",
};

interface NormalizeJobInput extends Omit<Job, "id"> {
  id?: string;
}

function normalizeOptionalString(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function fetchSourceText(source: JobSource, url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: REQUEST_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`${getJobSourceLabel(source)} returned ${response.status}.`);
  }

  return response.text();
}

export async function fetchSourceJson<T>(source: JobSource, url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: REQUEST_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`${getJobSourceLabel(source)} returned ${response.status}.`);
  }

  return (await response.json()) as T;
}

export function buildJobId(
  source: JobSource,
  url: string,
  title: string,
  company: string | null,
) {
  return createHash("sha1")
    .update([source, url, title, company ?? ""].join("|"))
    .digest("hex")
    .slice(0, 16);
}

export function toIsoString(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

export function normalizeJob(input: NormalizeJobInput): Job {
  const company = normalizeOptionalString(input.company);
  const location = normalizeOptionalString(input.location);
  const description = normalizeOptionalString(input.description);
  const tags = input.tags
    ?.map((tag) => tag.trim())
    .filter(Boolean);

  return {
    id:
      input.id ??
      buildJobId(input.source, input.url, input.title.trim(), company),
    source: input.source,
    title: input.title.trim(),
    company,
    location,
    publishedAt: normalizeOptionalString(input.publishedAt),
    url: input.url,
    description,
    tags: tags?.length ? tags : undefined,
  };
}

export function formatSourceError(source: JobSource, error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `${getJobSourceLabel(source)} could not be loaded.`;
}
