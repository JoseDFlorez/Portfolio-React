import { expect, test } from "@playwright/test";

test("projects list shows curated entries and filter narrows", async ({
  page,
}) => {
  await page.goto("/en/projects");
  const rows = page.locator("ul > li > a").filter({ hasText: /Read/ });
  const allCount = await rows.count();
  expect(allCount).toBeGreaterThanOrEqual(5);

  await page.getByRole("radio", { name: /Backend ·/ }).click();
  await page.waitForURL(/category=backend/);
  const filteredCount = await rows.count();
  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBeLessThanOrEqual(allCount);
});

test("a project detail page renders narrative + sibling nav", async ({
  page,
}) => {
  await page.goto("/en/projects/sgci-app");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /SGCI/i,
  );
  await expect(page.getByRole("link", { name: /Source/i }).first()).toBeVisible();
});
