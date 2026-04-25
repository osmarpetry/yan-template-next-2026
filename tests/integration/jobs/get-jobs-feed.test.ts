/* @vitest-environment node */

import { HttpResponse, http } from "msw";

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
  );
}

setupIntegrationMsw();

describe("getJobsFeed", () => {
  it("aggregates, normalizes, and sorts jobs from all sources", async () => {
    mockSuccessfulSources();

    const feed = await getJobsFeed();

    expect(feed.sources).toHaveLength(3);
    expect(feed.sources.every((source) => source.ok)).toBe(true);
    expect(feed.jobs).toHaveLength(3);
    expect(feed.jobs.map((job) => job.title)).toEqual([
      "Platform Engineer",
      "Senior Full Stack Engineer",
      "Senior Frontend Engineer",
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
    ]);

    const remotiveStatus = feed.sources.find(
      (source) => source.source === "remotive",
    );
    expect(remotiveStatus).toMatchObject({
      source: "remotive",
      count: 0,
      ok: false,
      fetchedAt: null,
    });
    expect(remotiveStatus?.error).toContain("returned 500");

    const successfulSources = feed.sources.filter((source) => source.ok);
    expect(successfulSources).toHaveLength(2);
    expect(successfulSources.every((source) => source.fetchedAt)).toBe(true);
  });

  it("returns an empty feed with source errors when every source fails", async () => {
    integrationMswServer.use(
      http.get(WE_WORK_REMOTELY_URL, () => new HttpResponse(null, { status: 503 })),
      http.get(REMOTIVE_URL, () => new HttpResponse(null, { status: 500 })),
      http.get(HN_SEARCH_URL, () => new HttpResponse(null, { status: 502 })),
    );

    const feed = await getJobsFeed();

    expect(feed.jobs).toEqual([]);
    expect(feed.sources).toHaveLength(3);
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
    ]);

    const remotiveStatus = feed.sources.find(
      (source) => source.source === "remotive",
    );
    expect(remotiveStatus?.ok).toBe(false);
    expect(remotiveStatus?.count).toBe(0);
    expect(remotiveStatus?.error).toBeTruthy();

    expect(
      feed.sources.filter((source) => source.ok).map((source) => source.source),
    ).toEqual(["we-work-remotely", "hn-hiring"]);
  });
});
