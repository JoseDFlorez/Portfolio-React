import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;

type MotionSetup = (gsap: Gsap) => void | (() => void);
type ScrollSetup = (gsap: Gsap, ScrollTrigger: ScrollTriggerPlugin) => void | (() => void);

let gsapPromise: Promise<Gsap> | null = null;
let scrollTriggerPromise: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerPlugin }> | null = null;

export const motionQueries = {
  reduceMotion: "(prefers-reduced-motion: reduce)",
  isDesktop: "(min-width: 768px)",
  isMobile: "(max-width: 767px)",
} as const;

export function isInitialMotionEnabled() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("motion-ok");
}

export function markMotionReady(targets: Element[]) {
  for (const target of targets) {
    target.setAttribute("data-motion-ready", "true");
  }
}

export function prepareMotionTargets(gsap: Gsap, targets: HTMLElement[], vars: gsap.TweenVars) {
  gsap.set(targets, vars);
  markMotionReady(targets);
}

export function registerGsap(): Promise<Gsap> {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then(({ gsap }) => {
      gsap.registerPlugin(useGSAP);
      gsap.defaults({
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
      return gsap;
    });
  }
  return gsapPromise;
}

export function registerScrollTrigger(): Promise<{
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerPlugin;
}> {
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = Promise.all([registerGsap(), import("gsap/ScrollTrigger")]).then(
      ([gsap, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      },
    );
  }
  return scrollTriggerPromise;
}

export function setMotionEndState(gsap: Gsap, targets: gsap.TweenTarget) {
  gsap.set(targets, {
    autoAlpha: 1,
    x: 0,
    y: 0,
    scale: 1,
    clearProps: "transform,opacity,visibility",
  });
}

export function useScopedGsap(
  scope: RefObject<Element | null>,
  setup: MotionSetup,
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      let active = true;
      let cleanup: (() => void) | undefined;
      let revertScoped: (() => void) | undefined;

      void registerGsap().then((gsap) => {
        if (!active || !scope.current) return;
        const scopedContext = gsap.context(() => {
          cleanup = setup(gsap) ?? undefined;
        }, scope);
        revertScoped = () => scopedContext.revert();
      });

      return () => {
        active = false;
        cleanup?.();
        revertScoped?.();
      };
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}

export function useScopedScrollTrigger(
  scope: RefObject<Element | null>,
  setup: ScrollSetup,
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      let active = true;
      let cleanup: (() => void) | undefined;
      let revertScoped: (() => void) | undefined;

      void registerScrollTrigger().then(({ gsap, ScrollTrigger }) => {
        if (!active || !scope.current) return;
        const scopedContext = gsap.context(() => {
          cleanup = setup(gsap, ScrollTrigger) ?? undefined;
        }, scope);
        revertScoped = () => scopedContext.revert();
      });

      return () => {
        active = false;
        cleanup?.();
        revertScoped?.();
      };
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}

export function useScrollReveal(
  scope: RefObject<Element | null>,
  selector = "[data-scroll-reveal]",
  dependencies: unknown[] = [],
) {
  useScopedScrollTrigger(
    scope,
    (gsap, ScrollTrigger) => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia(root);
      mm.add(motionQueries, (context) => {
        const conditions = context.conditions ?? {};
        const reduceMotion = Boolean(conditions.reduceMotion);
        const targets = gsap.utils.toArray<HTMLElement>(selector, root);

        if (reduceMotion || !isInitialMotionEnabled()) {
          markMotionReady(targets);
          setMotionEndState(gsap, targets);
          return;
        }

        prepareMotionTargets(gsap, targets, { opacity: 0, y: conditions.isMobile ? 14 : 24 });
        ScrollTrigger.batch(targets, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              clearProps: "transform,opacity,visibility",
            });
          },
        });
      });

      return () => mm.revert();
    },
    dependencies,
  );
}
