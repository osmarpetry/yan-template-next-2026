import type { Metadata } from "next";

import { JobsPage } from "@/components/jobs/jobs-page";
import { loadJobsFeed } from "@/server/load-jobs-feed";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "First raw jobs dashboard view aggregating We Work Remotely, Remotive, and HN Hiring.",
};

export const runtime = "nodejs";

export default async function JobsRoute() {
  const feed = await loadJobsFeed();

  return <JobsPage feed={feed} />;
}
