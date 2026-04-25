import { useMemo, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { skills } from "~/features/about/about.data";
import { getProjectSlugsForSkill } from "~/features/projects/projects.data";
import { useDelayedActiveValue } from "~/hooks/use-delayed-active-value";
import { useLocalePath } from "~/i18n/use-locale-path";
import { useScrollReveal } from "~/lib/motion";

export function SkillsMatrix() {
  const { t } = useTranslation("about");
  const { t: tp } = useTranslation("projects");
  const localePath = useLocalePath();
  const scopeRef = useRef<HTMLElement>(null);
  const skillInteraction = useDelayedActiveValue<string>();
  const activeProjectSlugs = useMemo(
    () =>
      skillInteraction.activeValue ? getProjectSlugsForSkill(skillInteraction.activeValue) : [],
    [skillInteraction.activeValue],
  );

  useScrollReveal(scopeRef, "[data-about-reveal]");

  return (
    <section ref={scopeRef} className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div data-about-reveal>
        <SectionNumeral
          numeral="004"
          label={t("skills_matrix.label")}
          suffix={t("skills_matrix.suffix")}
        />
      </div>
      <Hairline className="my-10" />
      <Tabs defaultValue={skills[0]?.id ?? "languages"} data-about-reveal>
        <TabsList className="flex h-auto flex-wrap justify-start gap-2 rounded-none border-b border-border bg-transparent p-0">
          {skills.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              className="rounded-none border border-transparent px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {t(`skills_labels.${group.id}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        {skills.map((group) => (
          <TabsContent key={group.id} value={group.id} className="mt-8 focus-visible:outline-none">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 font-heading text-xl font-light tracking-tight md:text-2xl">
              {group.items.map((item, idx) => (
                <li key={item} className="inline-flex items-baseline gap-2 text-foreground/85">
                  <span className="font-sans text-[10px] tabular-nums uppercase tracking-[0.22em] text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onPointerEnter={() => skillInteraction.activate(item)}
                    onPointerLeave={skillInteraction.scheduleReset}
                    onFocus={() => skillInteraction.activate(item)}
                    onBlur={skillInteraction.scheduleReset}
                    className="rounded-none text-left underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[active=true]:text-primary"
                    data-active={skillInteraction.activeValue === item ? "true" : "false"}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
      <div
        data-about-reveal
        data-skills-related-work
        className="mt-8 min-h-[8.5rem] border-l border-border pl-6 font-sans text-[12px] leading-relaxed text-muted-foreground md:min-h-24"
        aria-live="polite"
      >
        {skillInteraction.activeValue && activeProjectSlugs.length > 0 ? (
          <>
            <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/70">
              {t("skills_matrix.related_work")} · {skillInteraction.activeValue}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {activeProjectSlugs.map((slug) => (
                <Link
                  key={slug}
                  to={localePath(`/projects/${slug}`)}
                  viewTransition
                  className="border border-border px-3 py-2 uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {tp(`titles.${slug}`)}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.22em]">
            {t("skills_matrix.related_hint")}
          </p>
        )}
      </div>
    </section>
  );
}
