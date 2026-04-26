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
  {
    id: "landing-1",
    source: "landing-jobs",
    title: "Senior DevOps Engineer",
    company: "CliftonLarsonAllen",
    location: "Lisbon, PT",
    publishedAt: "2026-04-21T12:00:00.000Z",
    url: "https://example.com/landing-1",
    description: "Azure, Python, and CI/CD role from Landing.jobs.",
    tags: ["Landing.jobs", "Azure"],
  },
  {
    id: "greenhouse-1",
    source: "greenhouse",
    title: "Staff Design Engineer",
    company: "Vercel",
    location: "Remote - United States",
    publishedAt: "2026-04-20T12:00:00.000Z",
    url: "https://example.com/greenhouse-1",
    description: "Greenhouse board role for frontend systems.",
    tags: ["Design Systems"],
  },
  {
    id: "lever-1",
    source: "lever",
    title: "Staff Product Engineer",
    company: "Plaid",
    location: "London, UK",
    publishedAt: "2026-04-19T12:00:00.000Z",
    url: "https://example.com/lever-1",
    description: "Lever posting focused on product APIs.",
    tags: ["Product Engineering"],
  },
  {
    id: "ashby-1",
    source: "ashby",
    title: "Backend Engineer — Ingestion",
    company: "PostHog",
    location: "Remote EMEA",
    publishedAt: "2026-04-18T12:00:00.000Z",
    url: "https://example.com/ashby-1",
    description: "Analytics ingestion role from an Ashby board.",
    tags: ["Backend", "Analytics"],
  },
];

describe("filterJobs", () => {
  it("matches across title, location, source label, and description case-insensitively", () => {
    expect(
      filterJobs(jobs, {
        query: "react",
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toHaveLength(2);

    expect(
      filterJobs(jobs, {
        query: "remotive",
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toEqual([jobs[1]]);

    expect(
      filterJobs(jobs, {
        query: "remote us",
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toEqual([jobs[2]]);

    expect(
      filterJobs(jobs, {
        query: "landing jobs",
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toEqual([jobs[3]]);

    expect(
      filterJobs(jobs, {
        query: "ashby",
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toEqual([jobs[6]]);
  });

  it("supports AND terms, quoted phrases, and OR groups", () => {
    expect(
      filterJobs(jobs, {
        query: 'react typescript | "design systems"',
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toEqual([jobs[0], jobs[2], jobs[4]]);

    expect(
      filterJobs(jobs, {
        query: '"remote us" | pt',
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toEqual([jobs[2], jobs[3]]);

    expect(
      filterJobs(jobs, {
        query: "pt",
        enabledSources: [
          "we-work-remotely",
          "remotive",
          "hn-hiring",
          "landing-jobs",
          "greenhouse",
          "lever",
          "ashby",
        ],
      }),
    ).toEqual([jobs[3]]);
  });

  it("respects the enabled sources list before applying keyword search", () => {
    expect(
      filterJobs(jobs, {
        query: "",
        enabledSources: ["we-work-remotely", "hn-hiring", "ashby"],
      }),
    ).toEqual([jobs[0], jobs[2], jobs[6]]);

    expect(
      filterJobs(jobs, {
        query: "typescript",
        enabledSources: ["we-work-remotely"],
      }),
    ).toEqual([jobs[0]]);

    expect(
      filterJobs(jobs, {
        query: "product engineering",
        enabledSources: ["lever", "greenhouse"],
      }),
    ).toEqual([jobs[5]]);
  });
});
