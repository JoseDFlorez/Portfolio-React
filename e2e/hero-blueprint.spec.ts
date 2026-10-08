import { expect, test, type Page } from "@playwright/test";

async function packetPositions(page: Page) {
  return page.locator("[data-blueprint-packet]").evaluateAll((packets) =>
    packets.map((packet) => {
      const matrix = (packet as SVGGraphicsElement).getCTM();
      return [matrix?.e, matrix?.f];
    }),
  );
}

test("request packets keep moving after the hero entrance", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await page.waitForTimeout(4200);

  const before = await packetPositions(page);
  await expect.poll(() => packetPositions(page), { timeout: 3000 }).not.toEqual(before);
});

test("request motion can be paused and resumed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await page.getByRole("button", { name: "Pause animation", exact: true }).click({ timeout: 5000 });

  const paused = await packetPositions(page);
  await page.waitForTimeout(600);
  expect(await packetPositions(page)).toEqual(paused);

  await page.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect.poll(() => packetPositions(page)).not.toEqual(paused);
});

test("reduced motion keeps a complete static diagram in the hero", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const diagram = page.locator("svg:has([data-blueprint-node])");
  await expect(diagram).toBeVisible();
  await expect(page.getByRole("button", { name: /^(Pause|Play) animation$/ })).toHaveCount(0);

  const bounds = await diagram.evaluate((svg) => {
    const graphic = svg.getBoundingClientRect();
    const hero = svg.closest("section")!.getBoundingClientRect();
    return { left: graphic.left, right: graphic.right, heroLeft: hero.left, heroRight: hero.right };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(bounds.heroLeft);
  expect(bounds.right).toBeLessThanOrEqual(bounds.heroRight);

  const before = await packetPositions(page);
  await page.waitForTimeout(600);
  expect(await packetPositions(page)).toEqual(before);
});
