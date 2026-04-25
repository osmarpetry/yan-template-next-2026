import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, Then, When } = createBdd();

Given("the jobs dashboard is open", async ({ page }) => {
  await page.goto("/jobs");
  await expect(
    page.getByRole("heading", { name: /raw remote jobs, one operator dashboard/i }),
  ).toBeVisible();
});

When("I open the source filter menu", async ({ page }) => {
  await page.getByRole("button", { name: /filter jobs by source/i }).click();
});

Then("I should see the raw jobs review controls", async ({ page }) => {
  await expect(
    page.getByRole("searchbox", { name: /search visible jobs/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /filter jobs by source/i }),
  ).toBeVisible();
});

Then("I should see all source toggle options", async ({ page }) => {
  await expect(
    page.getByRole("menuitemcheckbox", { name: /We Work Remotely/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitemcheckbox", { name: /Remotive/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitemcheckbox", { name: /HN Hiring/i }),
  ).toBeVisible();
});
