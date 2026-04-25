import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { profile } from "~/features/about/about.data";
import { HeroBlueprint } from "~/features/home/components/hero-blueprint";
import {
  isInitialMotionEnabled,
  markMotionReady,
  motionQueries,
  prepareMotionTargets,
  setMotionEndState,
  useScopedGsap,
} from "~/lib/motion";

export function HeroSection() {
  const { t } = useTranslation("home");
  const scopeRef = useRef<HTMLElement>(null);

  useScopedGsap(scopeRef, (gsap) => {
    const root = scopeRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(motionQueries, (context) => {
      const reduceMotion = Boolean(context.conditions?.reduceMotion);
      const targets = gsap.utils.toArray<HTMLElement>("[data-hero-motion]", root);

      if (reduceMotion || !isInitialMotionEnabled()) {
        markMotionReady(targets);
        setMotionEndState(gsap, targets);
        return;
      }

      prepareMotionTargets(gsap, targets, { opacity: 0, y: 18 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.08,
        clearProps: "transform,opacity,visibility",
      });
    });

    return () => mm.revert();
  });

  return (
    <section
      ref={scopeRef}
      className="relative mx-auto grid max-w-7xl overflow-hidden px-4 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28 lg:px-16 lg:pt-32 lg:pb-40"
    >
      <HeroBlueprint />
      <div className="relative z-10 grid gap-10">
        <div data-hero-motion>
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
        </div>
        <h1
          data-hero-motion
          className="font-heading text-5xl font-light leading-[1.02] tracking-tight text-foreground md:text-7xl lg:text-[104px]"
        >
          <span className="block">{t("hero.h1_line_1")}</span>
          <span className="block italic text-muted-foreground">{t("hero.h1_line_2")}</span>
        </h1>
        <div data-hero-motion>
          <Hairline />
        </div>
        <p
          data-hero-motion
          className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground md:text-[15px]"
        >
          {t("hero.subhead")}
        </p>
      </div>
    </section>
  );
}
