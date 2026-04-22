import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { profile } from "~/features/about/about.data";

export function AboutMasthead() {
  const { t } = useTranslation("about");
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-16 md:px-8 md:pt-24 lg:px-16 lg:pt-32">
      <SectionNumeral
        numeral="000"
        label={t("masthead.label")}
        suffix={profile.location.toUpperCase()}
      />
      <h1 className="max-w-5xl font-heading text-5xl font-light leading-[1.02] tracking-tight md:text-7xl">
        <span className="block">{t("masthead.h1_line_1")}</span>
        <span className="block italic text-muted-foreground">
          {t("masthead.h1_line_2")}
        </span>
      </h1>
      <Hairline />
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-16">
        <figure className="flex flex-col gap-3">
          <div className="relative aspect-4/5 w-full overflow-hidden border border-border bg-secondary">
            <img
              src="/img/jose-portrait.jpg"
              alt={t("masthead.portrait_alt")}
              width={600}
              height={750}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover grayscale"
            />
          </div>
          <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="text-foreground">
              {profile.name.replace("David ", "D. ")}
            </span>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span>
              {profile.location.split(",")[0]?.toUpperCase() ?? ""},{" "}
              {profile.location.split(",").at(-1)?.trim().toUpperCase() ?? ""}
            </span>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span>{t("masthead.byline_role")}</span>
          </figcaption>
        </figure>

        <div className="flex flex-col justify-between gap-8 md:py-2">
          <p className="max-w-[44ch] font-heading text-2xl font-light leading-snug tracking-tight md:text-3xl">
            {t("lead")}
          </p>
          <aside className="flex flex-col gap-2 border-t border-dashed border-border pt-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {t("masthead.currently_prefix")}
            </p>
            <p className="font-heading text-xl font-light leading-tight tracking-tight">
              {profile.currentRole.company}
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {profile.currentRole.title} · {profile.currentRole.since} →
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
