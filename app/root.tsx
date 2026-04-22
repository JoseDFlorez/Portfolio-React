import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteLoaderData,
  useRouteError,
} from "react-router";
import { useMemo } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import type { Route } from "./+types/root";
import "./app.css";
import { themeInitScript } from "~/hooks/use-theme";
import { SiteShell } from "~/components/layout/site-shell";
import { SectionNumeral } from "~/components/editorial/section-numeral";
import { getBuildInfo, type BuildInfo } from "~/lib/build-info.server";
import { createCspNonce } from "~/lib/security-headers.server";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type Locale,
} from "~/i18n/locale";
import { createI18nInstance } from "~/i18n/config";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Geist+Mono:wght@100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export async function loader(): Promise<{ build: BuildInfo; cspNonce: string }> {
  return { build: getBuildInfo(), cspNonce: createCspNonce() };
}

function resolveLocaleFromMatches(
  matches: ReturnType<typeof useMatches>,
): Locale {
  for (const match of matches) {
    const params = match.params as { locale?: string };
    if (params?.locale && isSupportedLocale(params.locale)) {
      return params.locale;
    }
  }
  return DEFAULT_LOCALE;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const locale = resolveLocaleFromMatches(matches);
  const rootData = useRouteLoaderData<typeof loader>("root");
  const cspNonce = rootData?.cspNonce;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          nonce={cspNonce}
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={cspNonce} />
        <Scripts nonce={cspNonce} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default function App() {
  const { build } = useLoaderData<typeof loader>();
  return (
    <SiteShell build={build}>
      <Outlet />
    </SiteShell>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const matches = useMatches();
  const locale = resolveLocaleFromMatches(matches);
  const instance = useMemo(() => createI18nInstance(locale), [locale]);
  const build: BuildInfo = {
    sha: "dev",
    commitDate: new Date().toISOString().slice(0, 10),
    bootTime: new Date().toISOString(),
    tz: "UTC",
    nodeVersion: "unknown",
  };

  return (
    <I18nextProvider i18n={instance}>
      <ErrorBoundaryBody error={error} build={build} />
    </I18nextProvider>
  );
}

function ErrorBoundaryBody({
  error,
  build,
}: {
  error: unknown;
  build: BuildInfo;
}) {
  const { t } = useTranslation("common");
  let numeral = "500";
  let label = t("errors.error_label");
  let details = t("errors.generic_heading");
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    numeral = String(error.status).padStart(3, "0");
    label =
      error.status === 404
        ? t("errors.not_found_label")
        : error.statusText || label;
    details =
      error.status === 404
        ? t("errors.not_found_heading")
        : error.data ?? details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <SiteShell build={build}>
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32 lg:px-16">
        <SectionNumeral numeral={numeral} label={label} />
        <h1 className="mt-6 max-w-3xl font-heading text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
          {details}
        </h1>
        {stack ? (
          <pre className="mt-10 w-full overflow-x-auto border border-border p-4 text-xs">
            <code>{stack}</code>
          </pre>
        ) : null}
      </section>
    </SiteShell>
  );
}
