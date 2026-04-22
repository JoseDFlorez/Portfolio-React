import { createI18nInstance } from "./config";
import { pathWithoutLocale, type Locale, SUPPORTED_LOCALES } from "./locale";

type MetaEntry =
  | { title: string }
  | { name: string; content: string }
  | { tagName: "link"; rel: string; hrefLang?: string; href: string };

const SITE_URL =
  (typeof process !== "undefined" && process.env?.SITE_URL) ||
  "https://joseflorez.dev";

type MetaKind =
  | "home"
  | "about"
  | "projects"
  | "contact"
  | "not_found"
  | "project_not_found";

export function buildMetaEntries(
  locale: Locale,
  kind: MetaKind,
  override?: { title?: string; description?: string },
): MetaEntry[] {
  const instance = createI18nInstance(locale);
  const title =
    override?.title ?? (instance.t(`${kind}.title`, { ns: "meta" }) as string);
  const description =
    override?.description ??
    (instance.t(`${kind}.description`, { ns: "meta", defaultValue: "" }) as string);

  const entries: MetaEntry[] = [{ title }];
  if (description) entries.push({ name: "description", content: description });
  return entries;
}

export function alternateLinks(pathname: string): MetaEntry[] {
  const tail = pathWithoutLocale(pathname);
  const alternates: MetaEntry[] = SUPPORTED_LOCALES.map((locale) => ({
    tagName: "link" as const,
    rel: "alternate",
    hrefLang: locale,
    href: `${SITE_URL}/${locale}${tail === "/" ? "" : tail}`,
  }));
  alternates.push({
    tagName: "link",
    rel: "alternate",
    hrefLang: "x-default",
    href: `${SITE_URL}/en${tail === "/" ? "" : tail}`,
  });
  return alternates;
}
