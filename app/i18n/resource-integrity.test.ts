import { describe, expect, it } from "vitest";

import { projects } from "~/features/projects/projects.data";
import { experience, education, howIWork } from "~/features/about/about.data";

import enProjects from "./locales/en/projects.json";
import esProjects from "./locales/es/projects.json";
import enAbout from "./locales/en/about.json";
import esAbout from "./locales/es/about.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import enHome from "./locales/en/home.json";
import esHome from "./locales/es/home.json";
import enContact from "./locales/en/contact.json";
import esContact from "./locales/es/contact.json";
import enMeta from "./locales/en/meta.json";
import esMeta from "./locales/es/meta.json";

describe("i18n resource integrity", () => {
  it("has a translated title, summary, narrative, and thumbnail alt for every project slug in EN + ES", () => {
    for (const p of projects) {
      for (const bundle of [enProjects, esProjects]) {
        const titles = bundle.titles as Record<string, string>;
        const summaries = bundle.summaries as Record<string, string>;
        const narratives = bundle.narratives as Record<string, unknown[]>;
        const alts = bundle.thumbnail_alt as Record<string, string>;
        expect(titles[p.slug], `title/${p.slug}`).toBeTruthy();
        expect(summaries[p.slug], `summary/${p.slug}`).toBeTruthy();
        expect(narratives[p.slug], `narrative/${p.slug}`).toBeTruthy();
        expect(narratives[p.slug]!.length).toBeGreaterThan(0);
        expect(alts[p.slug], `alt/${p.slug}`).toBeTruthy();
      }
    }
  });

  it("has bullets in EN + ES for every experience entry id", () => {
    for (const entry of experience) {
      for (const bundle of [enAbout, esAbout]) {
        const bullets = (bundle.experience as Record<string, { bullets?: string[] }>)[entry.id]
          ?.bullets;
        expect(bullets?.length ?? 0).toBe(entry.bulletCount);
      }
    }
  });

  it("has an EN + ES entry for every education id", () => {
    for (const entry of education) {
      for (const bundle of [enAbout, esAbout]) {
        const row = (bundle.education as Record<string, { program?: string }>)[entry.id];
        expect(row?.program, `education/${entry.id}`).toBeTruthy();
      }
    }
  });

  it("covers at least N how-i-work entries in EN + ES", () => {
    for (const bundle of [enAbout, esAbout]) {
      expect(bundle.how_i_work.entries.length).toBeGreaterThanOrEqual(howIWork.length);
    }
  });

  it("has matching top-level namespace keys across EN and ES", () => {
    const pairs = [
      [enCommon, esCommon, "common"],
      [enHome, esHome, "home"],
      [enAbout, esAbout, "about"],
      [enProjects, esProjects, "projects"],
      [enContact, esContact, "contact"],
      [enMeta, esMeta, "meta"],
    ] as const;
    for (const [en, es, name] of pairs) {
      const enKeys = Object.keys(en).sort();
      const esKeys = Object.keys(es).sort();
      expect(esKeys, `${name} top-level parity`).toEqual(enKeys);
    }
  });
});
