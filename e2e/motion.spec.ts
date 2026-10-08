import { expect, test } from "@playwright/test";

test.describe("motion safety", () => {
  test("home hero stays visible in reduced motion immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const hero = page.getByRole("heading", { level: 1 });
    await expect(hero).toContainText(/Web applications/i);

    const styles = await hero.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        opacity: computed.opacity,
        transform: computed.transform,
        visibility: computed.visibility,
      };
    });

    expect(
      await page.evaluate(() => document.documentElement.classList.contains("motion-ok")),
    ).toBe(false);
    expect(styles.opacity).toBe("1");
    expect(styles.transform).toBe("none");
    expect(styles.visibility).toBe("visible");
  });

  test("motion gate does not re-hide hero after startup", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const hero = page.getByRole("heading", { level: 1 });
    await expect(hero).toContainText(/Web applications/i);
    await expect(hero).toHaveAttribute("data-motion-ready", "true");

    await page.waitForTimeout(2700);

    const styles = await hero.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        opacity: computed.opacity,
        transform: computed.transform,
        visibility: computed.visibility,
      };
    });

    expect(styles.opacity).toBe("1");
    expect(styles.transform).toBe("none");
    expect(styles.visibility).toBe("visible");
  });

  test("skill focus highlights related featured projects and resets", async ({ page }) => {
    await page.goto("/");

    const skill = page.getByRole("button", { name: "C#" });
    await skill.scrollIntoViewIfNeeded();
    await skill.focus();

    await expect(page.locator("[data-project-card='sgci-app']")).toHaveAttribute(
      "data-highlighted",
      "true",
    );
    await expect(page.locator("[data-project-card='formula1-webcomponents']")).toHaveCSS(
      "opacity",
      "0.45",
    );

    await page.getByRole("button", { name: "JavaScript" }).focus();
    await expect(page.locator("[data-project-card='formula1-webcomponents']")).toHaveAttribute(
      "data-highlighted",
      "true",
    );

    await page.getByRole("link", { name: /^View Projects/ }).focus();
    await expect(page.locator("[data-project-card='formula1-webcomponents']")).toHaveCSS(
      "opacity",
      "1",
    );
  });

  test("skills used outside featured work keep the featured projects readable", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en");
    await expect(page.getByRole("button", { name: "Pause animation", exact: true })).toBeVisible();

    const skill = page.getByRole("button", { name: "React", exact: true });
    await skill.scrollIntoViewIfNeeded();
    await skill.focus();
    await expect(skill).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("section").filter({ has: skill })).toContainText("Portfolio React");

    const featured = page.locator("[data-project-card]");
    await expect(featured).toHaveCount(4);
    for (const card of await featured.all()) {
      await expect(card).toHaveCSS("opacity", "1");
    }
  });

  test("about skills related-work panel does not shift the dossier section", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/about");

    const skill = page.getByRole("button", { name: "C#" });
    await skill.scrollIntoViewIfNeeded();

    const dossierHeading = page.getByRole("heading", {
      name: /The full background is in my CV/i,
    });
    const topBefore = await dossierHeading.evaluate(
      (element) => element.getBoundingClientRect().top,
    );

    await skill.hover();
    await expect(page.locator("[data-skills-related-work]")).toContainText(/Used in/i);

    const topAfter = await dossierHeading.evaluate(
      (element) => element.getBoundingClientRect().top,
    );

    expect(Math.abs(topAfter - topBefore)).toBeLessThan(1);
  });

  test("project rows remain clickable after motion hooks attach", async ({ page }) => {
    await page.goto("/en/projects");
    const row = page.getByRole("link", { name: /SGCI Inventory System/i }).first();
    await row.hover();
    await row.click();
    await expect(page).toHaveURL(/\/en\/projects\/sgci-app$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/SGCI/i);
  });

  test("reduced-motion navigation does not leave visible content hidden", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page
      .getByRole("link", { name: /^About$/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/about$/);

    const hiddenCount = await page.locator("main").evaluate((main) => {
      const elements = Array.from(main.querySelectorAll("h1, h2, p, a, button, img"));
      return elements.filter((element) => {
        const computed = window.getComputedStyle(element);
        return computed.visibility === "hidden" || computed.opacity === "0";
      }).length;
    });

    expect(hiddenCount).toBe(0);
  });

  test("project detail content remains visible after scroll and navigation", async ({ page }) => {
    await page.goto("/en/projects/sgci-app");
    await page.mouse.wheel(0, 900);
    await expect(page.getByText(/Architecture highlights/i)).toBeVisible();
    await page
      .getByRole("link", { name: /^Projects$/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("mobile home has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);
  });
});
