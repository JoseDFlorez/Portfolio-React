import { describe, expect, it } from "vitest";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getProjectFacets,
  getProjectSiblings,
  projects,
} from "./projects.data";
import { projectSchema } from "./projects.schema";
import enProjects from "~/i18n/locales/en/projects.json";

describe("projects data", () => {
  it("has every entry validating against the schema", () => {
    for (const p of projects) {
      expect(() => projectSchema.parse(p)).not.toThrow();
    }
  });

  it("enforces unique kebab-case slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) {
      expect(s).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("rejects invalid slugs at the schema level", () => {
    expect(() =>
      projectSchema.parse({
        ...projects[0]!,
        slug: "Has Spaces",
      }),
    ).toThrow();
  });

  it("returns four featured projects in reverse-chronological order", () => {
    const featured = getFeaturedProjects();
    expect(featured.map((p) => p.slug)).toEqual([
      "spacex-explorer",
      "sgci-app",
      "formula1-webcomponents",
      "todo-list-flask",
    ]);
    for (const p of featured) expect(p.featured).toBe(true);
  });

  it("looks up projects by slug", () => {
    const first = projects[0]!;
    expect(getProjectBySlug(first.slug)?.slug).toBe(first.slug);
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns sensible facets", () => {
    const facets = getProjectFacets();
    expect(facets.categories.length).toBeGreaterThan(0);
    expect(facets.stacks.length).toBeGreaterThan(0);
    const categorySum = facets.categories.reduce((a, c) => a + c.count, 0);
    expect(categorySum).toBe(projects.length);
  });

  it("returns siblings in list order", () => {
    const first = projects[0]!;
    const { prev, next } = getProjectSiblings(first.slug);
    expect(prev).toBeNull();
    expect(next?.slug).toBe(projects[1]?.slug);
  });

  it("has an i18n entry for every slug", () => {
    for (const p of projects) {
      expect(enProjects.titles[p.slug as keyof typeof enProjects.titles]).toBeTruthy();
      expect(enProjects.summaries[p.slug as keyof typeof enProjects.summaries]).toBeTruthy();
      expect(enProjects.narratives[p.slug as keyof typeof enProjects.narratives]).toBeTruthy();
      expect(
        enProjects.thumbnail_alt[p.slug as keyof typeof enProjects.thumbnail_alt],
      ).toBeTruthy();
    }
  });

  it("exposes archive items in i18n", () => {
    expect(enProjects.archive.items.length).toBeGreaterThan(0);
  });
});
