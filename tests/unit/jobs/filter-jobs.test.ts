import { filterJobs } from "@/features/jobs/utils/filter-jobs";
import type { Job } from "@/features/jobs/types";

const jobs: Job[] = [
  {
    id: "wwr-1",
    source: "we-work-remotely",
    title: "Senior Frontend Engineer",
    company: "Acme",
    location: "Remote Europe",
    publishedAt: "2026-04-24T12:00:00.000Z",
    url: "https://example.com/wwr-1",
    description: "React, Next.js, TypeScript, and performance work.",
    tags: ["React", "TypeScript"],
  },
  {
    id: "remotive-1",
    source: "remotive",
    title: "Platform Engineer",
    company: "Orbit",
    location: "Worldwide",
    publishedAt: "2026-04-23T12:00:00.000Z",
    url: "https://example.com/remotive-1",
    description: "Node.js and infrastructure role.",
    tags: ["Node.js"],
  },
  {
    id: "hn-1",
    source: "hn-hiring",
    title: "Senior Full Stack Engineer",
    company: "PrairieLearn",
    location: "Remote US",
    publishedAt: "2026-04-22T12:00:00.000Z",
    url: "https://example.com/hn-1",
    description: "TypeScript / Postgres / React / AI",
    tags: ["HN Hiring"],
  },
];

describe("filterJobs", () => {
  it("matches across title, location, source label, and description case-insensitively", () => {
    expect(
      filterJobs(jobs, {
        query: "react",
        enabledSources: ["we-work-remotely", "remotive", "hn-hiring"],
      }),
    ).toHaveLength(2);

    expect(
      filterJobs(jobs, {
        query: "remotive",
        enabledSources: ["we-work-remotely", "remotive", "hn-hiring"],
      }),
    ).toEqual([jobs[1]]);

    expect(
      filterJobs(jobs, {
        query: "remote us",
        enabledSources: ["we-work-remotely", "remotive", "hn-hiring"],
      }),
    ).toEqual([jobs[2]]);
  });

  it("respects the enabled sources list before applying keyword search", () => {
    expect(
      filterJobs(jobs, {
        query: "",
        enabledSources: ["we-work-remotely", "hn-hiring"],
      }),
    ).toEqual([jobs[0], jobs[2]]);

    expect(
      filterJobs(jobs, {
        query: "typescript",
        enabledSources: ["we-work-remotely"],
      }),
    ).toEqual([jobs[0]]);
  });
});
