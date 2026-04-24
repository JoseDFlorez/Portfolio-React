import { useRef } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { useLocalePath } from "~/i18n/use-locale-path";
import {
  isInitialMotionEnabled,
  markMotionReady,
  motionQueries,
  prepareMotionTargets,
  setMotionEndState,
  useScopedGsap,
} from "~/lib/motion";

export function HomeCtaRow() {
  const { t } = useTranslation("common");
  const localePath = useLocalePath();
  const scopeRef = useRef<HTMLDivElement>(null);

  useScopedGsap(scopeRef, (gsap) => {
    const root = scopeRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(motionQueries, (context) => {
      const buttons = gsap.utils.toArray<HTMLElement>("[data-home-cta]", root);
      if (context.conditions?.reduceMotion || !isInitialMotionEnabled()) {
        markMotionReady(buttons);
        setMotionEndState(gsap, buttons);
        return;
      }

      prepareMotionTargets(gsap, buttons, { opacity: 0, y: 12 });
      gsap.to(buttons, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        delay: 0.32,
        clearProps: "transform,opacity,visibility",
      });
    });

    return () => mm.revert();
  });

  return (
    <div
      ref={scopeRef}
      className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-10 md:flex-row md:items-center md:gap-6 md:px-8 md:pb-16 lg:px-16"
    >
      <Button
        data-home-cta
        asChild
        size="lg"
        className="rounded-none font-sans text-[12px] uppercase tracking-[0.2em]"
      >
        <Link to={localePath("/projects")} viewTransition>
          {t("buttons.view_projects")}
          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        data-home-cta
        asChild
        variant="outline"
        size="lg"
        className="rounded-none font-sans text-[12px] uppercase tracking-[0.2em]"
      >
        <Link to={localePath("/contact")} viewTransition>
          <MessageSquare className="mr-2 size-4" aria-hidden="true" />
          {t("buttons.get_in_touch")}
        </Link>
      </Button>
    </div>
  );
}
