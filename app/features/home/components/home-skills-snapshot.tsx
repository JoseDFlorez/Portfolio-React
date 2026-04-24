import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Hairline } from "~/components/editorial/hairline";
import { SectionNumeral } from "~/components/editorial/section-numeral";
import { useScrollReveal } from "~/lib/motion";

export type SkillsSnapshotRow = {
  id: string;
  label: string;
  items: string[];
};

type Props = {
  rows: SkillsSnapshotRow[];
  activeSkill?: string | null;
  onSkillActivate?: (skill: string) => void;
  onSkillDeactivate?: () => void;
};

export function HomeSkillsSnapshot({
  rows,
  activeSkill,
  onSkillActivate,
  onSkillDeactivate,
}: Props) {
  const { t } = useTranslation("home");
  const scopeRef = useRef<HTMLElement>(null);

  useScrollReveal(scopeRef, "[data-home-skills-reveal]");

  return (
    <section ref={scopeRef} className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div data-home-skills-reveal>
        <SectionNumeral numeral="003" label={t("skills.label")} suffix={t("skills.suffix")} />
      </div>
      <Hairline className="mt-8" reveal />
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.id}
            data-home-skills-reveal
            className="grid grid-cols-[auto,1fr] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[9rem,1fr] md:py-6"
          >
            <dt className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="flex flex-wrap gap-x-3 gap-y-2 font-sans text-sm leading-relaxed text-foreground md:text-[15px]">
              {row.items.map((item, idx) => {
                const isActive = activeSkill === item;
                return (
                  <span key={item} className="inline-flex items-center gap-x-3">
                    {idx > 0 ? (
                      <span aria-hidden="true" className="text-muted-foreground/50">
                        ·
                      </span>
                    ) : null}
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onPointerEnter={() => onSkillActivate?.(item)}
                      onPointerLeave={onSkillDeactivate}
                      onFocus={() => onSkillActivate?.(item)}
                      onBlur={onSkillDeactivate}
                      className="rounded-none text-left text-foreground/85 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[active=true]:text-primary"
                      data-active={isActive ? "true" : "false"}
                    >
                      {item}
                    </button>
                  </span>
                );
              })}
            </dd>
          </div>
        ))}
      </dl>
      <Hairline />
    </section>
  );
}
