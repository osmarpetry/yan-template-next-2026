import type { Metadata } from "next";

import { JobsPage } from "@/components/jobs/jobs-page";
import { getJobsFeed } from "@/server/jobs-service";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "First raw jobs dashboard view aggregating We Work Remotely, Remotive, and HN Hiring.",
};

export const runtime = "nodejs";

export default async function JobsRoute() {
  const feed = await getJobsFeed();

  return <JobsPage feed={feed} />;
}
