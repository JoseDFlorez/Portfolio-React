import { expect, test } from "@playwright/test";

test("contact form surfaces client-side validation errors", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByRole("button", { name: /Send message/i }).click();
  await expect(page.getByText(/share your name/i)).toBeVisible();
});

test("contact form submits successfully with valid data", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByPlaceholder("How should I address you?").fill("Test User");
  await page.getByPlaceholder("you@domain.com").fill("test@example.com");
  await page
    .getByPlaceholder("Short version of why you're writing.")
    .fill("Quick hello");
  await page
    .getByPlaceholder("What would you like to discuss?")
    .fill("This is a test message, long enough to pass validation.");
  await page.getByRole("button", { name: /Send message/i }).click();
  await expect(page.getByText(/Message sent/i)).toBeVisible({
    timeout: 10_000,
  });
});
