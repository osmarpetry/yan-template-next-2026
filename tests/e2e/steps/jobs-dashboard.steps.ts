import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, Then, When } = createBdd();

function getJobsTable(page: Page) {
  return page.getByRole("table", { name: /normalized remote jobs table/i });
}

Given("the jobs dashboard is open", async ({ page }) => {
  await page.goto("/jobs");
  await expect(
    page.getByRole("heading", { name: /raw remote jobs, one operator dashboard/i }),
  ).toBeVisible();
});

When("I open the source filter menu", async ({ page }) => {
  await page.getByRole("button", { name: /filter jobs by source/i }).click();
});

When("I disable the Ashby source", async ({ page }) => {
  await page.getByRole("menuitemcheckbox", { name: /Ashby/i }).click();
  await page.keyboard.press("Escape");
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
  await expect(
    page.getByRole("menuitemcheckbox", { name: /Landing\.jobs/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitemcheckbox", { name: /Greenhouse/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitemcheckbox", { name: /Lever/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitemcheckbox", { name: /Ashby/i }),
  ).toBeVisible();
});

When('I search visible jobs for "landing"', async ({ page }) => {
  await page.getByRole("searchbox", { name: /search visible jobs/i }).fill("landing");
});

When("I clear the jobs search", async ({ page }) => {
  await page.getByRole("searchbox", { name: /search visible jobs/i }).fill("");
});

Then("I should see all fixture jobs in the table", async ({ page }) => {
  const table = getJobsTable(page);

  await expect(table).toContainText("Senior Frontend Engineer");
  await expect(table).toContainText("Platform Engineer");
  await expect(table).toContainText("Senior Full Stack Engineer");
  await expect(table).toContainText("Senior DevOps Engineer");
  await expect(table).toContainText("Staff Design Engineer");
  await expect(table).toContainText("Staff Product Engineer");
  await expect(table).toContainText("Backend Engineer — Ingestion");
});

Then("I should see only the non-Ashby jobs in the table", async ({ page }) => {
  const table = getJobsTable(page);

  await expect(table).toContainText("Senior Frontend Engineer");
  await expect(table).toContainText("Platform Engineer");
  await expect(table).toContainText("Senior Full Stack Engineer");
  await expect(table).toContainText("Senior DevOps Engineer");
  await expect(table).toContainText("Staff Design Engineer");
  await expect(table).toContainText("Staff Product Engineer");
  await expect(table).not.toContainText("Backend Engineer — Ingestion");
});

Then("I should see only the Landing.jobs job in the table", async ({ page }) => {
  const table = getJobsTable(page);

  await expect(table).toContainText("Senior DevOps Engineer");
  await expect(table).toContainText("CliftonLarsonAllen");
  await expect(table).not.toContainText("Senior Frontend Engineer");
  await expect(table).not.toContainText("Platform Engineer");
  await expect(table).not.toContainText("Senior Full Stack Engineer");
  await expect(table).not.toContainText("Staff Design Engineer");
  await expect(table).not.toContainText("Staff Product Engineer");
  await expect(table).not.toContainText("Backend Engineer — Ingestion");
});

Then('I should see the jobs summary "Showing 7 of 7 jobs."', async ({ page }) => {
  await expect(page.getByText(/Showing 7 of 7 jobs\./)).toBeVisible();
});

Then('I should see the jobs summary "Showing 6 of 7 jobs."', async ({ page }) => {
  await expect(page.getByText(/Showing 6 of 7 jobs\./)).toBeVisible();
});

Then('I should see the jobs summary "Showing 1 of 7 jobs."', async ({ page }) => {
  await expect(page.getByText(/Showing 1 of 7 jobs\./)).toBeVisible();
});

Then('the source filter button should show "6 sources"', async ({ page }) => {
  await expect(
    page.getByRole("button", { name: /filter jobs by source/i }),
  ).toContainText("6 sources");
});
