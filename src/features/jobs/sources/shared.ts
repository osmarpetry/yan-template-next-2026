import { createHash } from "node:crypto";

import { getJobSourceLabel, type Job, type JobSource } from "@/features/jobs/types";

const REQUEST_HEADERS = {
  "user-agent": "find-remote-for-me/0.1 (+private operator dashboard)",
};

export interface JobSourceFetchResult {
  jobs: Job[];
  warning: string | null;
}

interface NormalizeJobInput extends Omit<Job, "id"> {
  id?: string;
}

function normalizeOptionalString(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function buildRequestInit(init?: RequestInit): RequestInit {
  const headers = new Headers(REQUEST_HEADERS);
  const extraHeaders = new Headers(init?.headers);

  extraHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  return {
    ...init,
    cache: init?.cache ?? "no-store",
    headers,
  };
}

export async function fetchSourceText(
  source: JobSource,
  url: string,
  init?: RequestInit,
) {
  const response = await fetch(url, buildRequestInit(init));

  if (!response.ok) {
    throw new Error(`${getJobSourceLabel(source)} returned ${response.status}.`);
  }

  return response.text();
}

export async function fetchSourceJson<T>(
  source: JobSource,
  url: string,
  init?: RequestInit,
) {
  const response = await fetch(url, buildRequestInit(init));

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

export function toIsoString(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
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

export function createSourceResult(
  jobs: Job[],
  warning: string | null = null,
): JobSourceFetchResult {
  return {
    jobs,
    warning,
  };
}

export function joinParts(parts: Array<string | null | undefined>, separator = " · ") {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(separator);
}

export function summarizeBoardFailures(
  failures: Array<{ company: string; reason: string }>,
) {
  if (failures.length === 0) {
    return null;
  }

  const detail = failures
    .map((failure) => `${failure.company} (${failure.reason})`)
    .join("; ");

  return `${failures.length} ${
    failures.length === 1 ? "board failed" : "boards failed"
  }: ${detail}`;
}
