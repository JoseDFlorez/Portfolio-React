import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  localeSchema,
  pathWithoutLocale,
  pickLocale,
} from "./locale";

describe("locale schema", () => {
  it("accepts supported locales", () => {
    for (const l of SUPPORTED_LOCALES) {
      expect(localeSchema.safeParse(l).success).toBe(true);
    }
  });

  it("rejects unsupported locales", () => {
    for (const tag of ["de", "fr", "EN", "", " en", "en-US"]) {
      expect(localeSchema.safeParse(tag).success).toBe(false);
    }
  });

  it("type-guards correctly", () => {
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("es")).toBe(true);
    expect(isSupportedLocale("de")).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
    expect(isSupportedLocale(42)).toBe(false);
  });
});

describe("pathWithoutLocale", () => {
  it("strips a leading locale prefix", () => {
    expect(pathWithoutLocale("/en")).toBe("/");
    expect(pathWithoutLocale("/es")).toBe("/");
    expect(pathWithoutLocale("/en/about")).toBe("/about");
    expect(pathWithoutLocale("/es/projects/sgci-app")).toBe(
      "/projects/sgci-app",
    );
  });

  it("returns unchanged for unknown prefixes", () => {
    expect(pathWithoutLocale("/about")).toBe("/about");
    expect(pathWithoutLocale("/")).toBe("/");
  });
});

describe("pickLocale", () => {
  it("defaults when no header", () => {
    expect(pickLocale(null)).toBe(DEFAULT_LOCALE);
    expect(pickLocale("")).toBe(DEFAULT_LOCALE);
  });

  it("picks es from an es-first Accept-Language", () => {
    expect(pickLocale("es-CO,es;q=0.9,en;q=0.8")).toBe("es");
  });

  it("picks en when es is not present", () => {
    expect(pickLocale("fr-FR,en-US;q=0.8")).toBe("en");
  });

  it("falls back to default when nothing matches", () => {
    expect(pickLocale("fr,de,it")).toBe(DEFAULT_LOCALE);
  });
});
