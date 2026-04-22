import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { profile } from "~/features/about/about.data";

export function HeroSection() {
  const { t } = useTranslation("home");
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28 lg:px-16 lg:pt-32 lg:pb-40">
      <SectionNumeral
        numeral="000"
        label={t("hero.eyebrow_label")}
        suffix={
          <>
            {profile.name.toUpperCase()}
            <span aria-hidden="true"> · </span>
            {profile.location.split(",")[0]?.toUpperCase() ?? ""}
          </>
        }
      />
      <h1 className="font-heading text-5xl font-light leading-[1.02] tracking-tight text-foreground md:text-7xl lg:text-[104px]">
        <span className="block">{t("hero.h1_line_1")}</span>
        <span className="block italic text-muted-foreground">
          {t("hero.h1_line_2")}
        </span>
      </h1>
      <Hairline />
      <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground md:text-[15px]">
        {t("hero.subhead")}
      </p>
    </section>
  );
}
