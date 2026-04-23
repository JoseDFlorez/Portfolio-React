import { expect, test } from "@playwright/test";

test("home renders with section numeral", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Backend systems/i);
  await expect(page.getByText(/Introduction/i)).toBeVisible();
});

test("navigation reaches every primary route", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /^About$/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page
    .getByRole("link", { name: /^Projects$/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page
    .getByRole("link", { name: /^Contact$/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("api health endpoint returns ok json", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.ok).toBe(true);
});

test("CV download link is present", async ({ page }) => {
  await page.goto("/");
  const cv = page.getByRole("link", { name: /^Download CV$/ }).first();
  await expect(cv).toHaveAttribute("href", /\/cv\/jose-florez-cv\.pdf$/);
  await expect(cv).toHaveAttribute("download", "");
});

test("unknown project slug renders 404 with section numeral", async ({ page }) => {
  const response = await page.goto("/en/projects/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/Not found/i)).toBeVisible();
});
