import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Hairline } from "~/components/editorial/hairline";
import { SectionNumeral } from "~/components/editorial/section-numeral";
import { useLocalePath } from "~/i18n/use-locale-path";
import { useScrollReveal } from "~/lib/motion";

export function HomeAboutStrip() {
  const { t } = useTranslation("home");
  const { t: ta } = useTranslation("about");
  const localePath = useLocalePath();
  const scopeRef = useRef<HTMLElement>(null);

  useScrollReveal(scopeRef, "[data-home-about-reveal]");

  return (
    <section ref={scopeRef} className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div data-home-about-reveal>
        <SectionNumeral
          numeral="002"
          label={t("about_strip.label")}
          suffix={t("about_strip.suffix")}
        />
      </div>
      <div className="mt-8 grid gap-10 md:grid-cols-[2fr,1fr] md:gap-16">
        <p
          data-home-about-reveal
          className="max-w-[44ch] font-heading text-2xl font-light leading-snug tracking-tight md:text-3xl"
        >
          {ta("lead")}
        </p>
        <div data-home-about-reveal className="flex flex-col justify-end gap-4">
          <Hairline reveal />
          <Link
            to={localePath("/about")}
            viewTransition
            className="group inline-flex items-center justify-between gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
          >
            {t("about_strip.read_long_version")}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
