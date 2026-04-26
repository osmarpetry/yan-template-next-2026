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
  {
    id: "fixture-landing-1",
    source: "landing-jobs",
    title: "Senior DevOps Engineer",
    company: "CliftonLarsonAllen",
    location: "Lisbon, PT",
    publishedAt: "2026-04-23T08:30:00.000Z",
    url: "https://example.com/jobs/landing-devops",
    description: "Landing.jobs sample role with Azure, Python, and CI/CD work.",
    tags: ["Landing.jobs", "Azure", "CI/CD"],
  },
  {
    id: "fixture-greenhouse-1",
    source: "greenhouse",
    title: "Staff Design Engineer",
    company: "Vercel",
    location: "Remote - United States",
    publishedAt: "2026-04-22T14:00:00.000Z",
    url: "https://example.com/jobs/greenhouse-design-engineer",
    description: "Greenhouse sample role around design systems and frontend architecture.",
    tags: ["Greenhouse", "Design Systems", "Frontend"],
  },
  {
    id: "fixture-lever-1",
    source: "lever",
    title: "Staff Product Engineer",
    company: "Plaid",
    location: "London, UK",
    publishedAt: "2026-04-21T10:00:00.000Z",
    url: "https://example.com/jobs/lever-product-engineer",
    description: "Lever sample role focused on APIs, product engineering, and scale.",
    tags: ["Lever", "APIs", "Product Engineering"],
  },
  {
    id: "fixture-ashby-1",
    source: "ashby",
    title: "Backend Engineer — Ingestion",
    company: "PostHog",
    location: "Remote (EMEA)",
    publishedAt: null,
    url: "https://example.com/jobs/ashby-backend-ingestion",
    description: "Ashby sample role for backend ingestion systems and analytics infrastructure.",
    tags: ["Ashby", "Backend", "Analytics"],
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
    warning: null,
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
      buildSourceStatus("landing-jobs"),
      buildSourceStatus("greenhouse"),
      buildSourceStatus("lever"),
      buildSourceStatus("ashby"),
    ],
    fetchedAt: FIXTURE_FETCHED_AT,
  };
}
