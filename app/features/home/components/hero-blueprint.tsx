import { useRef } from "react";

import { motionQueries, setMotionEndState, useScopedGsap } from "~/lib/motion";
import { cn } from "~/lib/utils";

export function HeroBlueprint({ className }: { className?: string }) {
  const scopeRef = useRef<SVGSVGElement>(null);

  useScopedGsap(scopeRef, (gsap) => {
    const root = scopeRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(motionQueries, (context) => {
      const reduceMotion = Boolean(context.conditions?.reduceMotion);
      const lines = gsap.utils.toArray<SVGPathElement>("[data-blueprint-line]", root);
      const nodes = gsap.utils.toArray<SVGElement>("[data-blueprint-node]", root);
      const packets = gsap.utils.toArray<SVGElement>("[data-blueprint-packet]", root);

      if (reduceMotion) {
        // No markMotionReady here: blueprint attributes aren't in the motion-ok CSS gate, so there's nothing to release.
        setMotionEndState(gsap, [...lines, ...nodes, ...packets]);
        gsap.set(lines, { strokeDashoffset: 0, clearProps: "strokeDashoffset,strokeDasharray" });
        return;
      }

      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(nodes, { autoAlpha: 0, scale: 0.82, transformOrigin: "50% 50%" });
      gsap.set(packets, { autoAlpha: 0, x: -18 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(lines, {
        strokeDashoffset: 0,
        duration: 0.72,
        stagger: 0.08,
      })
        .to(
          nodes,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.32,
            stagger: 0.05,
          },
          "-=0.42",
        )
        .to(
          packets,
          {
            autoAlpha: 0.85,
            x: 0,
            duration: 0.34,
            stagger: 0.08,
          },
          "-=0.2",
        )
        .to(packets, {
          autoAlpha: 0,
          duration: 0.28,
          stagger: 0.05,
          clearProps: "transform,opacity,visibility",
        });
    });

    return () => mm.revert();
  });

  return (
    <svg
      ref={scopeRef}
      viewBox="0 0 620 440"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-[-9rem] top-2 hidden h-[28rem] w-[40rem] text-foreground/70 opacity-[0.16] md:block lg:right-[-5rem] lg:top-12 dark:opacity-[0.22]",
        className,
      )}
    >
      <defs>
        <pattern id="hero-blueprint-grid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M 34 0 L 0 0 0 34" fill="none" stroke="currentColor" strokeWidth="0.45" />
        </pattern>
      </defs>
      <rect width="620" height="440" fill="url(#hero-blueprint-grid)" />
      <g fill="none" stroke="currentColor" strokeLinecap="square" strokeLinejoin="round">
        <path
          data-blueprint-line
          pathLength={1}
          strokeWidth="1.4"
          d="M98 132 H220 V86 H386 V132 H506"
        />
        <path
          data-blueprint-line
          pathLength={1}
          strokeWidth="1.4"
          d="M220 132 V224 H330 V286 H486"
        />
        <path data-blueprint-line pathLength={1} strokeWidth="1.4" d="M330 224 H438 V174 H530" />
        <path
          data-blueprint-line
          pathLength={1}
          strokeWidth="1.4"
          d="M98 286 H214 V346 H366 V300 H486"
        />
        <path
          data-blueprint-line
          pathLength={1}
          strokeWidth="1"
          strokeDasharray="7 7"
          d="M214 286 V224"
        />
      </g>
      <g data-blueprint-node>
        <rect
          x="46"
          y="104"
          width="104"
          height="56"
          fill="var(--background)"
          stroke="currentColor"
        />
        <text x="98" y="136" textAnchor="middle" className="fill-current font-sans text-[12px]">
          CLIENT
        </text>
      </g>
      <g data-blueprint-node>
        <rect
          x="220"
          y="54"
          width="166"
          height="64"
          fill="var(--background)"
          stroke="currentColor"
        />
        <text x="303" y="90" textAnchor="middle" className="fill-current font-sans text-[12px]">
          API / AUTH
        </text>
      </g>
      <g data-blueprint-node>
        <rect
          x="454"
          y="104"
          width="104"
          height="56"
          fill="var(--background)"
          stroke="currentColor"
        />
        <text x="506" y="136" textAnchor="middle" className="fill-current font-sans text-[12px]">
          RBAC
        </text>
      </g>
      <g data-blueprint-node>
        <rect
          x="254"
          y="192"
          width="152"
          height="64"
          fill="var(--background)"
          stroke="currentColor"
        />
        <text x="330" y="228" textAnchor="middle" className="fill-current font-sans text-[12px]">
          USE CASES
        </text>
      </g>
      <g data-blueprint-node>
        <rect
          x="486"
          y="146"
          width="88"
          height="56"
          fill="var(--background)"
          stroke="currentColor"
        />
        <text x="530" y="178" textAnchor="middle" className="fill-current font-sans text-[12px]">
          CACHE
        </text>
      </g>
      <g data-blueprint-node>
        <rect
          x="438"
          y="258"
          width="96"
          height="56"
          fill="var(--background)"
          stroke="currentColor"
        />
        <text x="486" y="290" textAnchor="middle" className="fill-current font-sans text-[12px]">
          DATA
        </text>
      </g>
      <g data-blueprint-node>
        <rect
          x="166"
          y="318"
          width="96"
          height="56"
          fill="var(--background)"
          stroke="currentColor"
        />
        <text x="214" y="350" textAnchor="middle" className="fill-current font-sans text-[12px]">
          TESTS
        </text>
      </g>
      <circle data-blueprint-packet cx="188" cy="132" r="4" fill="var(--primary)" />
      <circle data-blueprint-packet cx="430" cy="132" r="4" fill="var(--primary)" />
      <circle data-blueprint-packet cx="410" cy="286" r="4" fill="var(--primary)" />
    </svg>
  );
}
