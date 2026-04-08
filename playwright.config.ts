import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const port = Number(process.env.PORT ?? 3100);

const testDir = defineBddConfig({
  features: "tests/e2e/features/**/*.feature",
  steps: "tests/e2e/steps/**/*.ts",
  featuresRoot: "tests/e2e/features",
  outputDir: "tests/.features-gen",
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  timeout: 45_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `PORT=${port} pnpm dev`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
