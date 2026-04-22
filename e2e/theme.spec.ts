import { expect, test } from "@playwright/test";

test("theme toggle cycles and persists across reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Toggle theme/i }).click();
  await expect(page.locator("[data-slot='dropdown-menu-content']")).toBeVisible();
  await page.getByRole("menuitem", { name: /Dark/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
