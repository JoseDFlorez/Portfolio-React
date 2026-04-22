import { FileDown } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { MonogramJF } from "~/components/editorial/monogram";
import { SystemLedger } from "~/components/layout/system-ledger";
import type { BuildInfo } from "~/lib/build-info.server";
import { useLocalePath } from "~/i18n/use-locale-path";

const SOCIALS = [
  {
    key: "github",
    handle: "@JoseDFN",
    href: "https://github.com/JoseDFN",
  },
  {
    key: "linkedin",
    handle: "/in/josedavidflorez",
    href: "https://www.linkedin.com/in/josedavidflorez/",
  },
  {
    key: "email",
    handle: "jose.david.florez.navarrete",
    href: "mailto:jose.david.florez.navarrete@gmail.com",
  },
] as const;

const NAV_ITEMS = [
  { to: "/", labelKey: "nav.home" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/projects", labelKey: "nav.projects" },
  { to: "/contact", labelKey: "nav.contact" },
];

export function SiteFooter({ build }: { build: BuildInfo }) {
  const { t } = useTranslation("common");
  const localePath = useLocalePath();
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16 lg:px-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <MonogramJF className="text-foreground" />
            <span className="font-heading text-lg tracking-tight">
              José Flórez
            </span>
          </div>
          <p className="max-w-xs font-sans text-[12px] leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
          <a
            href="/cv/jose-florez-cv.pdf"
            download
            className="mt-2 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
          >
            <FileDown className="size-3.5" aria-hidden="true" />
            {t("buttons.download_cv")}
          </a>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {t("footer.navigation_heading")}
          </p>
          <ul className="flex flex-col gap-2 font-sans text-[12px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={localePath(item.to)}
                  viewTransition
                  className="uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:text-primary"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {t("footer.elsewhere_heading")}
          </p>
          <ul className="flex flex-col gap-2 font-sans text-[12px]">
            {SOCIALS.map(({ key, handle, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:") ? undefined : "noreferrer noopener"
                  }
                  className="inline-flex flex-col gap-0.5 text-foreground/80 transition-colors hover:text-primary"
                >
                  <span className="uppercase tracking-[0.16em]">
                    {t(`footer.socials.${key}`)}
                  </span>
                  <span className="text-[11px] text-muted-foreground group-hover:text-primary">
                    {handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SystemLedger build={build} />
    </footer>
  );
}
