/* @vitest-environment node */

import { HttpResponse, http } from "msw";

import {
  greenhouseBoards,
  leverBoards,
} from "@/features/jobs/sources/ats-company-boards";
import { getJobsFeed } from "@/server/jobs-service";

import {
  integrationMswServer,
  setupIntegrationMsw,
} from "../support/msw-server";

const WE_WORK_REMOTELY_URL =
  "https://weworkremotely.com/categories/remote-programming-jobs.rss";
const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";
const HN_SEARCH_URL = "https://hn.algolia.com/api/v1/search_by_date";
const HN_ITEM_URL = "https://hn.algolia.com/api/v1/items/:id";
const LANDING_JOBS_URL = "https://landing.jobs/api/v1/jobs";
const LANDING_COMPANY_URL = "https://landing.jobs/api/v1/companies/7766";
const ASHBY_URL = "https://jobs.ashbyhq.com/api/non-user-graphql";

const weWorkRemotelyXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss>
  <channel>
    <item>
      <title>Acme: Senior Frontend Engineer</title>
      <link>https://example.com/wwr-senior-frontend</link>
      <pubDate>Thu, 24 Apr 2026 09:00:00 GMT</pubDate>
      <description>&lt;p&gt;Headquarters: Remote Europe&lt;/p&gt;&lt;p&gt;React and Next.js platform work.&lt;/p&gt;</description>
      <category>Programming</category>
      <type>Full-Time</type>
      <skills>React, Next.js, TypeScript</skills>
    </item>
  </channel>
</rss>`;

function mockSuccessfulSources() {
  const greenhouseHandlers = greenhouseBoards.map((board) =>
    http.get(
      `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs`,
      () =>
        HttpResponse.json({
          jobs:
            board.token === "vercel"
              ? [
                  {
                    id: 8101,
                    absolute_url:
                      "https://job-boards.greenhouse.io/vercel/jobs/8101",
                    title: "Staff Design Engineer",
                    company_name: "Vercel",
                    content:
                      "<p>Frontend architecture, systems, and design tooling.</p>",
                    updated_at: "2026-04-22T19:37:39-04:00",
                    first_published: "2026-04-22T19:37:39-04:00",
                    location: {
                      name: "Remote - United States",
                    },
                    departments: [{ name: "Engineering" }],
                    offices: [{ name: "Remote", location: "United States" }],
                  },
                ]
              : [],
        }),
    ),
  );

  integrationMswServer.use(
    http.get(WE_WORK_REMOTELY_URL, () =>
      new HttpResponse(weWorkRemotelyXml, {
        status: 200,
        headers: { "content-type": "application/rss+xml" },
      }),
    ),
    http.get(REMOTIVE_URL, () =>
      HttpResponse.json({
        jobs: [
          {
            id: 9001,
            url: "https://example.com/remotive-platform",
            title: "Platform Engineer",
            company_name: "Orbit",
            category: "Software Development",
            tags: ["Node.js", "Infrastructure"],
            job_type: "Full-Time",
            publication_date: "2026-04-25T10:00:00.000Z",
            candidate_required_location: "Worldwide",
            description: "<p>Node.js and infrastructure role.</p>",
          },
        ],
      }),
    ),
    http.get(LANDING_JOBS_URL, ({ request }) => {
      expect(new URL(request.url).searchParams.get("limit")).toBe("25");

      return HttpResponse.json([
        {
          id: 19019,
          company_id: 7766,
          title: "Senior DevOps Engineer",
          url: "https://landing.jobs/at/cliftonlarsonallen/devops-engineer-in-lisbon-2025-1",
          published_at: "2026-03-03T11:55:01.551Z",
          remote: false,
          relocation_paid: false,
          role_description: "<p>Work on platform reliability and delivery pipelines.</p>",
          main_requirements: "<p>Azure, Python, CI/CD.</p>",
          nice_to_have: "",
          perks: "<p>Remote-first friendly benefits.</p>",
          type: "Full-time",
          tags: ["Azure", "Python", "CI/CD"],
          locations: [{ city: "Lisbon", country_code: "PT" }],
        },
      ]);
    }),
    http.get(LANDING_COMPANY_URL, () =>
      HttpResponse.json({
        id: 7766,
        name: "CliftonLarsonAllen",
      }),
    ),
    http.get(HN_SEARCH_URL, () =>
      HttpResponse.json({
        hits: [
          {
            objectID: "12345",
            author: "whoishiring",
            title: "Ask HN: Who is hiring? (April 2026)",
          },
        ],
      }),
    ),
    http.get(HN_ITEM_URL, () =>
      HttpResponse.json({
        id: 12345,
        title: "Ask HN: Who is hiring? (April 2026)",
        children: [
          {
            id: 4001,
            author: "prairielearn",
            text: `
              PrairieLearn | Senior Full Stack Engineer | Remote US
              <p>React, Postgres, and full-stack product work.</p>
              <p><a href="https://example.com/hn-full-stack">Apply</a></p>
            `,
            created_at: "2026-04-25T07:30:00.000Z",
          },
        ],
      }),
    ),
    ...greenhouseHandlers,
    http.get(
      `https://api.lever.co/v0/postings/${leverBoards[0].token}`,
      () =>
        HttpResponse.json([
          {
            id: "lever-plaid-1",
            text: "Staff Product Engineer",
            hostedUrl: "https://jobs.lever.co/plaid/lever-plaid-1",
            applyUrl: "https://jobs.lever.co/plaid/lever-plaid-1/apply",
            createdAt: 1753824031587,
            workplaceType: "remote",
            country: "UK",
            openingPlain: "Product engineering for APIs and developer workflows.",
            descriptionPlain: "Build financial infrastructure with product-minded teams.",
            additionalPlain: "Plaid powers APIs used across the US, UK, and Europe.",
            salaryDescriptionPlain: "",
            categories: {
              commitment: "Full-time",
              department: "Engineering",
              location: "London",
              team: "Product Engineering",
              allLocations: ["London", "Amsterdam"],
            },
            lists: [],
          },
        ]),
    ),
    http.post(ASHBY_URL, async ({ request }) => {
      const body = (await request.json()) as {
        variables?: { organizationHostedJobsPageName?: string };
      };

      if (body.variables?.organizationHostedJobsPageName === "posthog") {
        return HttpResponse.json({
          data: {
            jobBoard: {
              teams: [
                {
                  id: "team-posthog-engineering",
                  name: "Engineering",
                  externalName: null,
                  parentTeamId: null,
                },
              ],
              jobPostings: [
                {
                  id: "ashby-posthog-1",
                  title: "Backend Engineer — Ingestion",
                  locationName: "Remote (EMEA)",
                  locationId: "location-emea",
                  teamId: "team-posthog-engineering",
                  workplaceType: "Remote",
                  employmentType: "FullTime",
                  compensationTierSummary: null,
                  secondaryLocations: [
                    {
                      locationName: "Remote (UK)",
                      locationId: "location-uk",
                    },
                  ],
                },
              ],
            },
          },
        });
      }

      return HttpResponse.json({
        data: {
          jobBoard: {
            teams: [
              {
                id: "team-linear-engineering",
                name: "Engineering",
                externalName: null,
                parentTeamId: null,
              },
            ],
            jobPostings: [],
          },
        },
      });
    }),
  );
}

setupIntegrationMsw();

describe("getJobsFeed", () => {
  it("aggregates, normalizes, and sorts jobs from all sources", async () => {
    mockSuccessfulSources();

    const feed = await getJobsFeed();

    expect(feed.sources).toHaveLength(7);
    expect(feed.sources.every((source) => source.ok)).toBe(true);
    expect(feed.jobs).toHaveLength(7);
    expect(feed.jobs.map((job) => job.title)).toEqual([
      "Platform Engineer",
      "Senior Full Stack Engineer",
      "Senior Frontend Engineer",
      "Staff Design Engineer",
      "Senior DevOps Engineer",
      "Staff Product Engineer",
      "Backend Engineer — Ingestion",
    ]);

    const weWorkRemotelyJob = feed.jobs.find(
      (job) => job.source === "we-work-remotely",
    );
    expect(weWorkRemotelyJob).toMatchObject({
      title: "Senior Frontend Engineer",
      company: "Acme",
      location: "Remote Europe",
      url: "https://example.com/wwr-senior-frontend",
    });
    expect(weWorkRemotelyJob?.publishedAt).toBe("2026-04-24T09:00:00.000Z");
    expect(weWorkRemotelyJob?.description).toContain("React and Next.js");

    expect(feed.jobs.find((job) => job.source === "landing-jobs")).toMatchObject({
      title: "Senior DevOps Engineer",
      company: "CliftonLarsonAllen",
      location: "Lisbon, PT",
    });
    expect(feed.jobs.find((job) => job.source === "greenhouse")).toMatchObject({
      title: "Staff Design Engineer",
      company: "Vercel",
      location: "Remote - United States",
    });
    expect(feed.jobs.find((job) => job.source === "lever")).toMatchObject({
      title: "Staff Product Engineer",
      company: "Plaid",
    });
    expect(feed.jobs.find((job) => job.source === "ashby")).toMatchObject({
      title: "Backend Engineer — Ingestion",
      company: "PostHog",
      location: "Remote (EMEA) · Remote (UK)",
    });
  });

  it("keeps successful jobs visible when one source fails", async () => {
    mockSuccessfulSources();
    integrationMswServer.use(
      http.get(REMOTIVE_URL, () => new HttpResponse(null, { status: 500 })),
    );

    const feed = await getJobsFeed();

    expect(feed.jobs.map((job) => job.source)).toEqual([
      "hn-hiring",
      "we-work-remotely",
      "greenhouse",
      "landing-jobs",
      "lever",
      "ashby",
    ]);

    const remotiveStatus = feed.sources.find(
      (source) => source.source === "remotive",
    );
    expect(remotiveStatus).toMatchObject({
      source: "remotive",
      count: 0,
      ok: false,
      warning: null,
      fetchedAt: null,
    });
    expect(remotiveStatus?.error).toContain("returned 500");

    const successfulSources = feed.sources.filter((source) => source.ok);
    expect(successfulSources).toHaveLength(6);
    expect(successfulSources.every((source) => source.fetchedAt)).toBe(true);
  });

  it("returns an empty feed with source errors when every source fails", async () => {
    const greenhouseFailureHandlers = greenhouseBoards.map((board) =>
      http.get(
        `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs`,
        () => new HttpResponse(null, { status: 503 }),
      ),
    );
    integrationMswServer.use(
      http.get(WE_WORK_REMOTELY_URL, () => new HttpResponse(null, { status: 503 })),
      http.get(REMOTIVE_URL, () => new HttpResponse(null, { status: 500 })),
      http.get(LANDING_JOBS_URL, () => new HttpResponse(null, { status: 502 })),
      http.get(HN_SEARCH_URL, () => new HttpResponse(null, { status: 502 })),
      ...greenhouseFailureHandlers,
      http.get(
        `https://api.lever.co/v0/postings/${leverBoards[0].token}`,
        () => new HttpResponse(null, { status: 502 }),
      ),
      http.post(ASHBY_URL, () => new HttpResponse(null, { status: 503 })),
    );

    const feed = await getJobsFeed();

    expect(feed.jobs).toEqual([]);
    expect(feed.sources).toHaveLength(7);
    expect(feed.sources.every((source) => !source.ok)).toBe(true);
    expect(feed.sources.every((source) => source.error)).toBe(true);
    expect(feed.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("treats schema parsing failures as source-specific errors", async () => {
    mockSuccessfulSources();
    integrationMswServer.use(
      http.get(REMOTIVE_URL, () =>
        HttpResponse.json({
          jobs: [{ id: "broken-payload" }],
        }),
      ),
    );

    const feed = await getJobsFeed();

    expect(feed.jobs.map((job) => job.source)).toEqual([
      "hn-hiring",
      "we-work-remotely",
      "greenhouse",
      "landing-jobs",
      "lever",
      "ashby",
    ]);

    const remotiveStatus = feed.sources.find(
      (source) => source.source === "remotive",
    );
    expect(remotiveStatus?.ok).toBe(false);
    expect(remotiveStatus?.count).toBe(0);
    expect(remotiveStatus?.error).toBeTruthy();

    expect(
      feed.sources.filter((source) => source.ok).map((source) => source.source),
    ).toEqual([
      "we-work-remotely",
      "hn-hiring",
      "landing-jobs",
      "greenhouse",
      "lever",
      "ashby",
    ]);
  });

  it("surfaces board-level warnings when one ATS board fails but others succeed", async () => {
    mockSuccessfulSources();
    integrationMswServer.use(
      http.get(
        "https://boards-api.greenhouse.io/v1/boards/gitlab/jobs",
        () => new HttpResponse(null, { status: 504 }),
      ),
    );

    const feed = await getJobsFeed();

    const greenhouseStatus = feed.sources.find(
      (source) => source.source === "greenhouse",
    );

    expect(greenhouseStatus).toMatchObject({
      source: "greenhouse",
      ok: true,
      count: 1,
    });
    expect(greenhouseStatus?.warning).toContain("GitLab");
    expect(greenhouseStatus?.warning).toContain("returned 504");
    expect(feed.jobs.some((job) => job.source === "greenhouse")).toBe(true);
  });
});
