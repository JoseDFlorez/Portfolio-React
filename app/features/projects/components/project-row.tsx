import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import type { Project } from "~/features/projects/projects.schema";
import { useLocalePath } from "~/i18n/use-locale-path";

export function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { t } = useTranslation("projects");
  const localePath = useLocalePath();
  const numeral = String(index + 1).padStart(3, "0");
  const title = t(`titles.${project.slug}`);
  const summary = t(`summaries.${project.slug}`);
  const altText = t(`thumbnail_alt.${project.slug}`);
  return (
    <li>
      <Link
        to={localePath(`/projects/${project.slug}`)}
        viewTransition
        className="group grid gap-6 py-10 md:grid-cols-[auto,1fr,auto] md:gap-10"
      >
        <div className="flex items-start gap-4 md:w-64">
          <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.2em] text-muted-foreground">
            {numeral}
          </span>
          <div className="relative aspect-4/3 w-full overflow-hidden border border-border bg-secondary">
            <img
              src={project.thumbnail}
              alt={altText}
              loading="lazy"
              style={{ viewTransitionName: `project-${project.slug}` }}
              className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
            />
          </div>
        </div>
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>{t(`categories.${project.category}`)}</span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span>{project.stack.slice(0, 3).join(" · ")}</span>
          </div>
          <h3 className="font-heading text-2xl font-normal leading-tight tracking-tight md:text-[32px]">
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
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </li>
  );
}
