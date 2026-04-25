import { createJobsFeedFixture } from "@/features/jobs/testing/jobs-feed-fixture";

import { getJobsFeed } from "./jobs-service";

export async function loadJobsFeed() {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.JOBS_FEED_MODE === "fixture"
  ) {
    return createJobsFeedFixture();
  }

  return getJobsFeed();
}
