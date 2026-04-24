import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Hairline } from "~/components/editorial/hairline";
import { SectionNumeral } from "~/components/editorial/section-numeral";
import { useLocalePath } from "~/i18n/use-locale-path";
import { useScrollReveal } from "~/lib/motion";

export function HomeContactCta() {
  const { t } = useTranslation("home");
  const localePath = useLocalePath();
  const scopeRef = useRef<HTMLElement>(null);

  useScrollReveal(scopeRef, "[data-home-contact-reveal]");

  return (
    <section ref={scopeRef} className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div data-home-contact-reveal>
        <SectionNumeral
          numeral="004"
          label={t("contact_cta.label")}
          suffix={t("contact_cta.suffix")}
        />
      </div>
      <Hairline className="mt-8" reveal />
      <div className="mt-10 grid gap-10 md:grid-cols-[3fr,1fr] md:items-end md:gap-16">
        <h2
          data-home-contact-reveal
          className="font-heading text-5xl font-light leading-[1.04] tracking-tight md:text-7xl"
        >
          <span className="block">{t("contact_cta.headline_1")}</span>
          <span className="block italic text-muted-foreground">{t("contact_cta.headline_2")}</span>
        </h2>
        <Link
          data-home-contact-reveal
          to={localePath("/contact")}
          viewTransition
          className="group inline-flex items-center justify-between gap-4 border border-foreground px-5 py-4 font-sans text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <span>{t("contact_cta.open_contact")}</span>
          <ArrowUpRight
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
