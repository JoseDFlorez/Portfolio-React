import { describe, expect, it } from "vitest";
import { education, experience, howIWork, profile, skills } from "./about.data";
import enAbout from "~/i18n/locales/en/about.json";

describe("about data", () => {
  it("lists at least one experience entry with Planeta IP top", () => {
    expect(experience.length).toBeGreaterThan(0);
    expect(experience[0]?.company).toMatch(/Planeta IP/);
  });

  it("includes Saint Leo and Campuslands in education", () => {
    const institutions = education.map((e) => e.institution);
    expect(institutions).toContain("Saint Leo University");
    expect(institutions).toContain("Campuslands");
  });

  it("has three how-i-work slots", () => {
    expect(howIWork.length).toBe(3);
    expect(enAbout.how_i_work.entries.length).toBeGreaterThanOrEqual(3);
    for (const entry of enAbout.how_i_work.entries.slice(0, 3)) {
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.body.length).toBeGreaterThan(0);
    }
  });

  it("exposes non-empty skill groups", () => {
    expect(skills.length).toBeGreaterThan(0);
    for (const g of skills) expect(g.items.length).toBeGreaterThan(0);
  });

  it("has a consistent profile", () => {
    expect(profile.name).toMatch(/José/);
    expect(profile.email).toMatch(/@/);
    expect(profile.latestExperience.company).toMatch(/Planeta IP/);
  });

  it("has an i18n bullet array per experience entry", () => {
    for (const entry of experience) {
      const bullets = (enAbout.experience as Record<string, { bullets?: string[] }>)[entry.id]
        ?.bullets;
      expect(bullets?.length ?? 0).toBe(entry.bulletCount);
    }
  });
});
