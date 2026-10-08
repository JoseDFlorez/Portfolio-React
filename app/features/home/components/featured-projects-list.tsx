import { useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { ProjectImage } from "~/features/projects/components/project-image";
import type { Project } from "~/features/projects/projects.schema";
import { getProjectSlugsForSkill } from "~/features/projects/projects.data";
import { useLocalePath } from "~/i18n/use-locale-path";
import { cn } from "~/lib/utils";
import { useScopedGsap, useScrollReveal } from "~/lib/motion";

type Props = {
  projects: Project[];
  activeSkill?: string | null;
};

export function FeaturedProjectsList({ projects, activeSkill }: Props) {
  const { t } = useTranslation("home");
  const localePath = useLocalePath();
  const scopeRef = useRef<HTMLElement>(null);
  const relatedSlugs = useMemo(
    () => new Set(activeSkill ? getProjectSlugsForSkill(activeSkill) : []),
    [activeSkill],
  );
  const hasActiveRelation = projects.some((project) => relatedSlugs.has(project.slug));

  useScrollReveal(scopeRef, "[data-featured-reveal]", [], {
    duration: 0.28,
    stagger: 0.03,
    start: "top 95%",
    distance: 12,
  });

  return (
    <section ref={scopeRef} className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div data-featured-reveal className="flex items-end justify-between gap-4">
        <SectionNumeral numeral="001" label={t("featured.label")} suffix={t("featured.suffix")} />
        <Link
          to={localePath("/projects")}
          viewTransition
          className="group inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
        >
          {t("featured.all_projects")}
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
      <h2
        data-featured-reveal
        className="mt-6 max-w-2xl font-heading text-3xl font-light leading-tight tracking-tight md:text-5xl"
      >
        {t("featured.h2")}
      </h2>
      <div className="mt-10 overflow-hidden border border-border">
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          {projects.map((p, idx) => (
            <FeaturedProjectCard
              key={p.slug}
              project={p}
              index={idx}
              href={localePath(`/projects/${p.slug}`)}
              highlighted={hasActiveRelation && relatedSlugs.has(p.slug)}
              dimmed={hasActiveRelation && !relatedSlugs.has(p.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectCard({
  project,
  index,
  href,
  highlighted,
  dimmed,
}: {
  project: Project;
  index: number;
  href: string;
  highlighted: boolean;
  dimmed: boolean;
}) {
  const { t } = useTranslation("projects");
  const scopeRef = useRef<HTMLAnchorElement>(null);

  useScopedGsap(scopeRef, (gsap) => {
    const card = scopeRef.current;
    if (!card) return;

    const image = card.querySelector("[data-featured-image]");
    const title = card.querySelector("[data-featured-title]");
    const arrow = card.querySelector("[data-featured-arrow]");
    const meta = card.querySelector("[data-featured-meta]");

    const tl = gsap
      .timeline({ paused: true, defaults: { duration: 0.34, ease: "power2.out" } })
      .to(image, { scale: 1.035 }, 0)
      .to(title, { x: 6, color: "var(--primary)" }, 0)
      .to(meta, { x: 6 }, 0.03)
      .to(arrow, { x: 4, y: -4, color: "var(--primary)" }, 0);

    const play = () => tl.play();
    const reverse = () => tl.reverse();

    card.addEventListener("pointerenter", play);
    card.addEventListener("pointerleave", reverse);
    card.addEventListener("focusin", play);
    card.addEventListener("focusout", reverse);

    return () => {
      card.removeEventListener("pointerenter", play);
      card.removeEventListener("pointerleave", reverse);
      card.removeEventListener("focusin", play);
      card.removeEventListener("focusout", reverse);
      tl.kill();
    };
  });

  return (
    <Link
      ref={scopeRef}
      to={href}
      viewTransition
      data-featured-reveal
      data-project-card={project.slug}
      data-highlighted={highlighted ? "true" : "false"}
      className={cn(
        "group relative flex min-h-75 flex-col justify-between gap-8 bg-background p-6 transition-[background-color,opacity] duration-150 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-85 md:p-8",
        highlighted && "bg-primary/5",
        dimmed && "opacity-45",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.18em] text-muted-foreground">
          00{index + 1}
        </span>
        <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.18em] text-muted-foreground">
          {project.year}
        </span>
      </div>
      <div className="relative aspect-16/10 overflow-hidden border border-border bg-secondary">
        <ProjectImage
          dataAttribute="data-featured-image"
          project={project}
          alt={t(`thumbnail_alt.${project.slug}`)}
          loading="lazy"
          revealOnScroll
          sizes="(min-width: 1280px) 560px, (min-width: 768px) calc((100vw - 7rem) / 2), calc(100vw - 3rem)"
          className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0"
        />
      </div>
      <div className="min-w-0">
        <h3
          data-featured-title
          className="font-heading text-2xl font-normal leading-tight md:text-[28px]"
        >
          {t(`titles.${project.slug}`)}
        </h3>
        <p
          data-featured-meta
          className="mt-3 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          {t(`categories.${project.category}`)} · {project.stack.slice(0, 3).join(" · ")}
        </p>
      </div>
      <ArrowUpRight
        data-featured-arrow
        className="size-4 self-end text-muted-foreground"
        aria-hidden="true"
      />
    </Link>
  );
}
