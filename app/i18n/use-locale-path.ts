import { useParams } from "react-router";

import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "./locale";

export function useLocale(): Locale {
  const params = useParams();
  return isSupportedLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
}

export function useLocalePath() {
  const locale = useLocale();
  return (path: string) => prefixLocalePath(locale, path);
}

export function prefixLocalePath(locale: Locale, path: string): string {
  if (path === "/" || path === "") return `/${locale}`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}
