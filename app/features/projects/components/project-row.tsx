import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { ProjectImage } from "~/features/projects/components/project-image";
import type { Project } from "~/features/projects/projects.schema";
import { useLocalePath } from "~/i18n/use-locale-path";
import { useScopedGsap } from "~/lib/motion";

export function ProjectRow({
  project,
  index,
  reveal = false,
}: {
  project: Project;
  index: number;
  reveal?: boolean;
}) {
  const { t } = useTranslation("projects");
  const localePath = useLocalePath();
  const scopeRef = useRef<HTMLAnchorElement>(null);
  const numeral = String(index + 1).padStart(3, "0");
  const title = t(`titles.${project.slug}`);
  const summary = t(`summaries.${project.slug}`);
  const altText = t(`thumbnail_alt.${project.slug}`);

  useScopedGsap(scopeRef, (gsap) => {
    const row = scopeRef.current;
    if (!row) return;

    const image = row.querySelector("[data-row-image]");
    const heading = row.querySelector("[data-row-heading]");
    const meta = row.querySelector("[data-row-meta]");
    const action = row.querySelector("[data-row-action]");

    const tl = gsap
      .timeline({ paused: true, defaults: { duration: 0.32, ease: "power2.out" } })
      .to(image, { scale: 1.035 }, 0)
      .to(heading, { x: 8, color: "var(--primary)" }, 0)
      .to(meta, { x: 8 }, 0.03)
      .to(action, { x: 4, y: -4, color: "var(--primary)" }, 0);

    const play = () => tl.play();
    const reverse = () => tl.reverse();

    row.addEventListener("pointerenter", play);
    row.addEventListener("pointerleave", reverse);
    row.addEventListener("focusin", play);
    row.addEventListener("focusout", reverse);

    return () => {
      row.removeEventListener("pointerenter", play);
      row.removeEventListener("pointerleave", reverse);
      row.removeEventListener("focusin", play);
      row.removeEventListener("focusout", reverse);
      tl.kill();
    };
  });

  return (
    <li>
      <Link
        ref={scopeRef}
        data-project-list-row={reveal ? "true" : undefined}
        to={localePath(`/projects/${project.slug}`)}
        viewTransition
        className="group grid gap-6 py-10 md:grid-cols-[auto,1fr,auto] md:gap-10"
      >
        <div className="flex items-start gap-4 md:w-64">
          <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.2em] text-muted-foreground">
            {numeral}
          </span>
          <div className="relative aspect-4/3 w-full overflow-hidden border border-border bg-secondary">
            <ProjectImage
              dataAttribute="data-row-image"
              project={project}
              alt={altText}
              loading="lazy"
              sizes="(min-width: 768px) 256px, calc(100vw - 4rem)"
              style={{ viewTransitionName: `project-${project.slug}` }}
              className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
            />
          </div>
        </div>
        <div className="min-w-0 space-y-3">
          <div
            data-row-meta
            className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            <span>{t(`categories.${project.category}`)}</span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span>{project.stack.slice(0, 3).join(" · ")}</span>
          </div>
          <h3
            data-row-heading
            className="font-heading text-2xl font-normal leading-tight tracking-tight md:text-[32px]"
          >
            {title}
          </h3>
          <p className="max-w-2xl font-sans text-[13px] leading-relaxed text-muted-foreground">
            {summary}
          </p>
        </div>
        <div className="flex items-start justify-between gap-4 md:flex-col md:items-end md:justify-between">
          <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.2em] text-muted-foreground">
            {project.year}
          </span>
          <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground">
            {t("list.row.read")}
            <ArrowUpRight data-row-action className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </li>
  );
}
