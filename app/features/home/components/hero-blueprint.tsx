import { useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

import { motionQueries, useScopedGsap } from "~/lib/motion";
import { cn } from "~/lib/utils";

const nodes = [
  { id: "client", x: 28, y: 158, width: 112, height: 64 },
  { id: "api", x: 212, y: 64, width: 152, height: 76 },
  { id: "application", x: 212, y: 226, width: 152, height: 76 },
  { id: "data", x: 424, y: 226, width: 112, height: 76 },
  { id: "cache", x: 424, y: 64, width: 112, height: 76 },
] as const;

const connections = [
  { id: "request", path: "M140 190 H174 V102 H212", to: "api", at: 0, duration: 1 },
  { id: "dispatch", path: "M288 140 V226", to: "application", at: 1.2, duration: 0.7 },
  { id: "query", path: "M364 264 H424", to: "data", at: 2.2, duration: 0.55 },
  { id: "cache", path: "M336 226 V190 H480 V140", to: "cache", at: 2.4, duration: 1 },
  { id: "query-response", path: "M424 264 H364", to: "application", at: 3, duration: 0.55 },
  { id: "dispatch-response", path: "M288 226 V140", to: "api", at: 3.85, duration: 0.7 },
  { id: "response", path: "M212 102 H174 V190 H140", to: "client", at: 4.85, duration: 1 },
] as const;

export function HeroBlueprint({ className }: { className?: string }) {
  const { t } = useTranslation("home");
  const scopeRef = useRef<HTMLElement>(null);
  const syncPlaybackRef = useRef<(() => void) | null>(null);
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [motionAvailable, setMotionAvailable] = useState(false);
  const gridId = useId();

  useScopedGsap(scopeRef, (gsap) => {
    const root = scopeRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(motionQueries, (context) => {
      const paths = gsap.utils.toArray<SVGPathElement>("[data-blueprint-line]", root);
      const blocks = gsap.utils.toArray<SVGGElement>("[data-blueprint-node]", root);
      const packets = gsap.utils.toArray<SVGGElement>("[data-blueprint-packet]", root);
      const highlights = gsap.utils.toArray<SVGRectElement>("[data-blueprint-highlight]", root);
      const canAnimate = !context.conditions?.reduceMotion && !context.conditions?.isMobile;
      setMotionAvailable(canAnimate);

      gsap.set(packets, { autoAlpha: 0 });
      gsap.set(highlights, { autoAlpha: 0 });
      if (!canAnimate) return;

      // Measure each fixed SVG path once. Frame updates only move the packet wrapper.
      const routes = connections.map((connection) => {
        const path = root.querySelector<SVGPathElement>(
          `[data-blueprint-line="${connection.id}"]`,
        )!;
        const packet = root.querySelector<SVGGElement>(
          `[data-blueprint-packet="${connection.id}"]`,
        )!;
        const highlight = root.querySelector<SVGRectElement>(
          `[data-blueprint-highlight="${connection.to}"]`,
        )!;
        const length = path.getTotalLength();
        const origin = path.getPointAtLength(0);
        gsap.set(packet, { x: origin.x, y: origin.y });
        return {
          ...connection,
          path,
          packet,
          highlight,
          length,
          setX: gsap.quickSetter(packet, "x", "px"),
          setY: gsap.quickSetter(packet, "y", "px"),
        };
      });

      const flow = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
      for (const route of routes) {
        const position = { progress: 0 };
        const arrival = route.at + route.duration;
        flow
          .set(route.packet, { autoAlpha: 1 }, route.at)
          .fromTo(
            position,
            { progress: 0 },
            {
              progress: 1,
              duration: route.duration,
              ease: "none",
              immediateRender: false,
              onUpdate: () => {
                const point = route.path.getPointAtLength(position.progress * route.length);
                route.setX(point.x);
                route.setY(point.y);
              },
            },
            route.at,
          )
          .to(route.packet, { autoAlpha: 0, duration: 0.14 }, arrival)
          .fromTo(
            route.highlight,
            { autoAlpha: 0 },
            {
              autoAlpha: 0.9,
              duration: 0.16,
              immediateRender: false,
            },
            arrival,
          )
          .to(route.highlight, { autoAlpha: 0, duration: 0.6 }, arrival + 0.2);
      }

      gsap.set(paths, {
        strokeDasharray: (_, path: SVGPathElement) => path.getTotalLength(),
        strokeDashoffset: (_, path: SVGPathElement) => path.getTotalLength(),
      });

      const animation = gsap.timeline({ paused: true });
      animation
        .to(paths, {
          strokeDashoffset: 0,
          duration: 0.65,
          stagger: 0.04,
          clearProps: "strokeDashoffset,strokeDasharray",
        })
        .from(
          blocks,
          {
            autoAlpha: 0,
            y: 6,
            duration: 0.45,
            stagger: 0.06,
            clearProps: "transform,opacity,visibility",
          },
          0.15,
        )
        .add(flow, 1);

      let inView = false;
      const syncPlayback = () => {
        animation.paused(pausedRef.current || !inView || document.hidden);
      };
      syncPlaybackRef.current = syncPlayback;
      const observer = new IntersectionObserver(
        ([entry]) => {
          inView = Boolean(entry?.isIntersecting);
          syncPlayback();
        },
        { threshold: 0.08 },
      );
      observer.observe(root);
      document.addEventListener("visibilitychange", syncPlayback);

      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
        syncPlaybackRef.current = null;
      };
    });

    return () => mm.revert();
  });

  function togglePlayback() {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setIsPaused(next);
    syncPlaybackRef.current?.();
  }

  return (
    <figure
      ref={scopeRef}
      className={cn(
        "relative hidden w-full min-w-0 md:block md:max-w-xl md:justify-self-end lg:max-w-none",
        className,
      )}
    >
      <figcaption className="flex min-h-11 items-center justify-between gap-4 border-b border-border">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="mr-3 text-primary" aria-hidden="true">
            01 /
          </span>
          {t("blueprint.label")}
          <span className="sr-only">. {t("blueprint.description")}</span>
        </span>
        {motionAvailable ? (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={t(isPaused ? "blueprint.play" : "blueprint.pause")}
            aria-pressed={isPaused}
            className="grid size-11 shrink-0 touch-manipulation place-items-center text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isPaused ? (
              <Play className="size-3.5" aria-hidden="true" />
            ) : (
              <Pause className="size-3.5" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </figcaption>
      <svg
        viewBox="0 0 560 340"
        width={560}
        height={340}
        aria-hidden="true"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id={gridId} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0 H0 V28" fill="none" stroke="var(--border)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="560" height="340" fill={`url(#${gridId})`} opacity="0.5" />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
          className="text-muted-foreground/50"
        >
          {connections.map((connection) => (
            <path
              key={connection.id}
              data-blueprint-line={connection.id}
              d={connection.path}
              strokeOpacity={connection.id.endsWith("response") ? 0 : 1}
            />
          ))}
        </g>
        {nodes.map((node) => (
          <g key={node.id} data-blueprint-node={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              fill="var(--background)"
              stroke="var(--border)"
            />
            <rect
              data-blueprint-highlight={node.id}
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              opacity={0}
            />
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2 - 4}
              textAnchor="middle"
              className="fill-foreground font-sans text-[13px] tracking-[0.04em]"
            >
              {t(`blueprint.nodes.${node.id}.title`)}
            </text>
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2 + 14}
              textAnchor="middle"
              className="fill-muted-foreground font-sans text-[10px]"
            >
              {t(`blueprint.nodes.${node.id}.detail`)}
            </text>
          </g>
        ))}
        {connections.map((connection) => (
          <g key={connection.id} data-blueprint-packet={connection.id} opacity={0}>
            <circle r="9" fill="var(--primary)" opacity="0.14" />
            <circle r="3.5" fill="var(--primary)" />
          </g>
        ))}
      </svg>
    </figure>
  );
}
