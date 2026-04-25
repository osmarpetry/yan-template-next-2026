import { getJobSourceLabel, type Job, type JobSource, type JobsFeed } from "@/features/jobs/types";

const FIXTURE_FETCHED_AT = "2026-04-25T08:30:00.000Z";

const fixtureJobs: ReadonlyArray<Job> = [
  {
    id: "fixture-wwr-1",
    source: "we-work-remotely",
    title: "Senior Frontend Engineer",
    company: "Acme",
    location: "Remote Europe",
    publishedAt: "2026-04-24T09:00:00.000Z",
    url: "https://example.com/jobs/wwr-senior-frontend",
    description: "React, Next.js, TypeScript, and performance work.",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    id: "fixture-remotive-1",
    source: "remotive",
    title: "Platform Engineer",
    company: "Orbit",
    location: "Worldwide",
    publishedAt: "2026-04-25T10:00:00.000Z",
    url: "https://example.com/jobs/remotive-platform",
    description: "Node.js, infrastructure, and remote platform operations.",
    tags: ["Node.js", "Infrastructure", "Platform"],
  },
  {
    id: "fixture-hn-1",
    source: "hn-hiring",
    title: "Senior Full Stack Engineer",
    company: "PrairieLearn",
    location: "Remote US",
    publishedAt: "2026-04-25T07:30:00.000Z",
    url: "https://example.com/jobs/hn-full-stack",
    description: "Postgres, React, and product-minded full-stack delivery.",
    tags: ["Postgres", "React", "HN Hiring"],
  },
];

function buildSourceStatus(source: JobSource) {
  const count = fixtureJobs.filter((job) => job.source === source).length;

  return {
    source,
    label: getJobSourceLabel(source),
    count,
    ok: true,
    error: null,
    fetchedAt: FIXTURE_FETCHED_AT,
  };
}

export function createJobsFeedFixture(): JobsFeed {
  return {
    jobs: fixtureJobs.map((job) => ({
      ...job,
      tags: job.tags ? [...job.tags] : undefined,
    })),
    sources: [
      buildSourceStatus("we-work-remotely"),
      buildSourceStatus("remotive"),
      buildSourceStatus("hn-hiring"),
    ],
    fetchedAt: FIXTURE_FETCHED_AT,
  };
}
