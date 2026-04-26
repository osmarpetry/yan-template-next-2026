import type { Metadata } from "next";

import { JobsPage } from "@/components/jobs/jobs-page";
import { loadJobsFeed } from "@/server/load-jobs-feed";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Raw jobs dashboard aggregating public remote boards and selected ATS company boards.",
};

export const runtime = "nodejs";

export default async function JobsRoute() {
  const feed = await loadJobsFeed();

  return <JobsPage feed={feed} />;
}
