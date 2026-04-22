import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const localeSchema = z.enum(SUPPORTED_LOCALES);

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function pathWithoutLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|es)(\/.*)?$/);
  if (!match) return pathname || "/";
  return match[2] ?? "/";
}

export function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const preferred = acceptLanguage
    .split(",")
    .map((tag) => tag.trim().split(";")[0].toLowerCase().slice(0, 2));
  for (const tag of preferred) {
    if (isSupportedLocale(tag)) return tag;
  }
  return DEFAULT_LOCALE;
}
