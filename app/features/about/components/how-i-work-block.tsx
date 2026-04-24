import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { howIWork } from "~/features/about/about.data";
import { useScrollReveal } from "~/lib/motion";

type HowEntry = { title: string; body: string };

export function HowIWorkBlock() {
  const { t } = useTranslation("about");
  const scopeRef = useRef<HTMLElement>(null);
  const entries = t("how_i_work.entries", {
    returnObjects: true,
    defaultValue: [] as HowEntry[],
  }) as HowEntry[];

  useScrollReveal(scopeRef, "[data-about-reveal]");

  return (
    <section ref={scopeRef} className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div data-about-reveal>
        <SectionNumeral
          numeral="003"
          label={t("how_i_work.label")}
          suffix={t("how_i_work.suffix")}
        />
      </div>
      <h2
        data-about-reveal
        className="mt-6 max-w-3xl font-heading text-3xl font-light leading-tight tracking-tight md:text-5xl"
      >
        {t("how_i_work.h2")}
      </h2>
      <Hairline className="my-10" />
      <div className="grid gap-12 md:grid-cols-3 md:gap-8">
        {howIWork.map((slot, idx) => {
          const entry = entries[slot.index] ?? { title: "", body: "" };
          return (
            <article
              key={slot.index}
              data-about-reveal
              className="flex flex-col gap-4 border-t border-border pt-6"
            >
              <p className="font-sans text-[10px] tabular-nums uppercase tracking-[0.22em] text-muted-foreground">
                0{idx + 1}
              </p>
              <h3 className="font-heading text-2xl font-light leading-tight tracking-tight">
                {entry.title}
              </h3>
              <p className="font-sans text-[14px] leading-relaxed text-foreground/85">
                {entry.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
