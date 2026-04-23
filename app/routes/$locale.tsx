import { useMemo } from "react";
import { data, Outlet } from "react-router";
import { I18nextProvider } from "react-i18next";

import type { Route } from "./+types/$locale";
import { createI18nInstance } from "~/i18n/config";
import { localeSchema } from "~/i18n/locale";

export async function loader({ params }: Route.LoaderArgs) {
  const parsed = localeSchema.safeParse(params.locale);
  if (!parsed.success) {
    throw data("Unknown locale.", { status: 404 });
  }
  return { locale: parsed.data };
}

export default function LocaleLayout({ loaderData }: Route.ComponentProps) {
  const instance = useMemo(() => createI18nInstance(loaderData.locale), [loaderData.locale]);
  return (
    <I18nextProvider i18n={instance}>
      <Outlet />
    </I18nextProvider>
  );
}
