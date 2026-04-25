import { createSnippet, decodeHtmlEntities, stripHtml } from "@/features/jobs/utils/text";

import { fetchSourceText, normalizeJob, toIsoString } from "./shared";

const WE_WORK_REMOTELY_URL =
  "https://weworkremotely.com/categories/remote-programming-jobs.rss";

function extractItems(xml: string) {
  return Array.from(
    xml.matchAll(/<item>([\s\S]*?)<\/item>/gi),
    (match) => match[1],
  );
}

function extractTag(item: string, tag: string) {
  const pattern = new RegExp(
    `<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,
    "i",
  );
  const match = item.match(pattern);
  return match ? decodeHtmlEntities(match[1].trim()) : null;
}

function splitTitle(rawTitle: string) {
  const separatorIndex = rawTitle.indexOf(":");

  if (separatorIndex === -1) {
    return {
      company: null,
      title: rawTitle.trim(),
    };
  }

  return {
    company: rawTitle.slice(0, separatorIndex).trim(),
    title: rawTitle.slice(separatorIndex + 1).trim(),
  };
}

function extractHeadquarters(descriptionHtml: string | null) {
  const description = stripHtml(descriptionHtml);
  const match = description.match(/Headquarters:\s*(.+?)(?:\n|$)/i);
  return match?.[1]?.trim() ?? null;
}

function splitList(value: string | null) {
  return value
    ?.split(/[,/|]/)
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

export async function fetchWeWorkRemotelyJobs() {
  const xml = await fetchSourceText("we-work-remotely", WE_WORK_REMOTELY_URL);

  return extractItems(xml).map((item) => {
    const rawTitle = extractTag(item, "title") ?? "Untitled role";
    const descriptionHtml = extractTag(item, "description");
    const { company, title } = splitTitle(rawTitle);

    return normalizeJob({
      source: "we-work-remotely",
      title,
      company,
      location:
        extractHeadquarters(descriptionHtml) ?? extractTag(item, "region"),
      publishedAt: toIsoString(extractTag(item, "pubDate")),
      url:
        extractTag(item, "link") ??
        extractTag(item, "guid") ??
        "https://weworkremotely.com",
      description: createSnippet(descriptionHtml, 300),
      tags: [
        extractTag(item, "category"),
        extractTag(item, "type"),
        ...splitList(extractTag(item, "skills")),
      ].filter(Boolean) as string[],
    });
  });
}
