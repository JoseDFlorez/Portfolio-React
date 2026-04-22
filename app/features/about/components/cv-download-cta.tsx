import { ArrowRight, FileDown } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { Button } from "~/components/ui/button";
import { useLocalePath } from "~/i18n/use-locale-path";

export function CvDownloadCta() {
  const { t } = useTranslation("about");
  const localePath = useLocalePath();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <SectionNumeral numeral="005" label={t("cv_cta.label")} />
      <Hairline className="my-10" />
      <div className="grid gap-10 md:grid-cols-[2fr,1fr] md:items-end md:gap-16">
        <h2 className="max-w-3xl font-heading text-3xl font-light leading-tight tracking-tight md:text-5xl">
          {t("cv_cta.headline")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-none font-sans text-[12px] uppercase tracking-[0.2em]"
          >
            <a href="/cv/jose-florez-cv.pdf" download>
              <FileDown className="mr-2 size-4" aria-hidden="true" />
              {t("cv_cta.download")}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-none font-sans text-[12px] uppercase tracking-[0.2em]"
          >
            <Link to={localePath("/contact")} viewTransition>
              {t("cv_cta.contact")}
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
