import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, Then, When } = createBdd();

Given("the sample task demo is open", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/product foundation/i)).toBeVisible();
});

When("I start a sample task", async ({ page }) => {
  await page.getByRole("button", { name: /start sample task/i }).click();
  await expect(page.getByTestId("active-task-id")).not.toHaveText("none");
});

When("I refresh the page during the run", async ({ page }) => {
  await expect(page.getByText(/bootstrapping the shared workspace/i)).toBeVisible();
  await page.reload();
});

When("I reconnect the live stream", async ({ page }) => {
  await expect(page.getByText(/streaming sample progress over socket\.io/i)).toBeVisible();
  await page.getByRole("button", { name: /reconnect stream/i }).click();
});

Then("I should see staged task progress", async ({ page }) => {
  await expect(page.getByText(/bootstrapping the shared workspace/i)).toBeVisible();
  await expect(page.getByText(/streaming sample progress over socket\.io/i)).toBeVisible();
});

Then("the active task should still be restored", async ({ page }) => {
  await expect(page.getByTestId("active-task-id")).not.toHaveText("none");
  await expect(
    page.getByText(/verifying snapshot recovery for refreshes and reconnects/i),
  ).toBeVisible();
});

Then("the task should still complete", async ({ page }) => {
  await expect(
    page.getByText(/task completed with a durable snapshot/i),
  ).toBeVisible();
});
