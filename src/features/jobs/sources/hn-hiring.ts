import { z } from "zod";

import { createSnippet, extractFirstExternalUrl, stripHtml } from "@/features/jobs/utils/text";

import { fetchSourceJson, normalizeJob } from "./shared";

const HN_SEARCH_URL =
  "https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring&query=Ask%20HN%3A%20Who%20is%20hiring%3F";

const HN_ITEM_URL = "https://hn.algolia.com/api/v1/items";

const hnStorySearchSchema = z.object({
  hits: z.array(
    z.object({
      objectID: z.string(),
      author: z.string().nullish(),
      title: z.string().nullish(),
    }),
  ),
});

const hnCommentSchema = z.object({
  id: z.number(),
  author: z.string().nullish(),
  text: z.string().nullish(),
  created_at: z.string().nullish(),
});

const hnThreadSchema = z.object({
  id: z.number(),
  title: z.string().nullish(),
  children: z.array(hnCommentSchema).default([]),
});

const rolePattern =
  /\b(engineer|developer|manager|designer|architect|product|devops|sre|qa|scientist|lead|director|frontend|backend|full[-\s]?stack|platform)\b/i;

function titleCaseAuthor(author: string | null | undefined) {
  if (!author) {
    return "HN Hiring";
  }

  return author
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function looksLikeLocation(value: string) {
  return (
    /\b(remote|worldwide|europe|emea|us|usa|uk|germany|switzerland|luxembourg|berlin|london|amsterdam|cyprus|miami|nyc|san francisco|onsite|on-site|hybrid)\b/i.test(
      value,
    ) || /,\s*[A-Z][a-z]+/.test(value)
  );
}

function looksLikeEmploymentMeta(value: string) {
  return /\b(full[- ]?time|part[- ]?time|contract|freelance|visa|relocation|equity|salary)\b/i.test(
    value,
  );
}

function looksLikeRole(value: string) {
  return rolePattern.test(value);
}

function extractParentheticalLocation(value: string) {
  const matches = Array.from(value.matchAll(/\(([^)]+)\)/g), (match) =>
    match[1].trim(),
  );

  return matches.find(looksLikeLocation) ?? null;
}

function cleanSegment(value: string) {
  return value.replace(/\bhttps?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
}

function cleanCompany(value: string) {
  const location = extractParentheticalLocation(value);
  const withoutLocation = location
    ? value.replace(`(${location})`, "")
    : value;

  return cleanSegment(withoutLocation) || null;
}

function parseHeader(header: string, author: string | null | undefined) {
  const normalizedHeader = header
    .replace(/\s+[—–]\s+/g, " | ")
    .replace(/\s+-\s+/g, " | ");
  const parts = normalizedHeader
    .split("|")
    .map((part) => cleanSegment(part))
    .filter(Boolean);

  if (parts.length === 0) {
    return {
      company: titleCaseAuthor(author),
      title: "HN Hiring post",
      location: null,
    };
  }

  const firstPartLocation = extractParentheticalLocation(parts[0]);
  const hasExplicitCompany =
    parts.length > 1 && !looksLikeRole(parts[0]) && !looksLikeEmploymentMeta(parts[1]);

  const company = hasExplicitCompany ? cleanCompany(parts[0]) : titleCaseAuthor(author);
  const title = hasExplicitCompany ? parts[1] : parts[0];
  const titleIndex = hasExplicitCompany ? 1 : 0;
  const location =
    firstPartLocation ??
    parts
      .slice(titleIndex + 1)
      .find((part) => looksLikeLocation(part) && !looksLikeEmploymentMeta(part)) ??
    null;

  return {
    company,
    title,
    location,
  };
}

function getHeaderLine(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean) ?? "";
}

export async function fetchHnHiringJobs() {
  const searchPayload = hnStorySearchSchema.parse(
    await fetchSourceJson("hn-hiring", HN_SEARCH_URL),
  );

  const latestThreadId = searchPayload.hits.find(
    (story) =>
      story.author === "whoishiring" &&
      story.title?.toLowerCase().startsWith("ask hn: who is hiring"),
  )?.objectID;

  if (!latestThreadId) {
    throw new Error("Unable to locate the latest HN Hiring thread.");
  }

  const thread = hnThreadSchema.parse(
    await fetchSourceJson("hn-hiring", `${HN_ITEM_URL}/${latestThreadId}`),
  );

  return thread.children
    .filter((comment) => comment.text?.trim())
    .map((comment) => {
      const cleanedText = stripHtml(comment.text);
      const header = getHeaderLine(cleanedText);
      const { company, title, location } = parseHeader(header, comment.author);
      const description =
        cleanedText === header
          ? cleanedText
          : cleanedText.slice(header.length).trimStart();

      return normalizeJob({
        id: `hn-hiring-${comment.id}`,
        source: "hn-hiring",
        title: title || `HN Hiring post #${comment.id}`,
        company,
        location,
        publishedAt: comment.created_at ?? null,
        url:
          extractFirstExternalUrl(comment.text) ??
          `https://news.ycombinator.com/item?id=${comment.id}`,
        description: createSnippet(description || cleanedText, 300),
        tags: thread.title ? [thread.title] : undefined,
      });
    })
    .filter((job) => job.description || job.title);
}
