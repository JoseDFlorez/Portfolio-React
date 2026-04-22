import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { YearNumeral } from "~/components/editorial/year-numeral";
import { experience } from "~/features/about/about.data";

export function ExperienceTimeline() {
  const { t } = useTranslation("about");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <SectionNumeral
        numeral="001"
        label={t("experience.label")}
        suffix={t("experience.suffix")}
      />
      <h2 className="mt-6 max-w-3xl font-heading text-3xl font-light leading-tight tracking-tight md:text-5xl">
        {t("experience.h2")}
      </h2>
      <Hairline className="my-10" />
      <ul className="flex flex-col gap-16">
        {experience.map((entry) => {
          const bullets = t(`experience.${entry.id}.bullets`, {
            returnObjects: true,
            defaultValue: [] as string[],
          }) as string[];
          const role = t(`experience.${entry.id}.role`);
          return (
            <li key={`${entry.company}-${entry.yearStart}`}>
              <div className="grid gap-8 md:grid-cols-[auto,1fr] md:gap-12">
                <div className="flex items-start gap-4 md:w-40">
                  <YearNumeral year={entry.yearStart} />
                  <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {entry.yearEnd === null
                      ? t("experience.present")
                      : `${t("experience.ended_prefix")}${entry.yearEnd}`}
                  </p>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-heading text-2xl font-normal tracking-tight md:text-3xl">
                      {role}
                    </h3>
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {entry.location}
                    </p>
                  </div>
                  <p className="mt-2 font-sans text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                    {entry.company}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3 border-l border-border pl-6 font-sans text-[14px] leading-relaxed text-foreground/85 md:text-[15px]">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.6em] h-px w-3 shrink-0 bg-foreground"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
