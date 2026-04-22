import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import type { Project } from "~/features/projects/projects.schema";

export function ProjectHeader({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { t } = useTranslation("projects");
  const numeral = String(index + 1).padStart(3, "0");
  return (
    <header className="flex flex-col gap-10">
      <SectionNumeral
        numeral={numeral}
        label={t(`categories.${project.category}`)}
        suffix={`${t(`roles.${project.slug}`).toUpperCase()} · ${project.year}`}
      />
      <h1 className="max-w-4xl font-heading text-5xl font-light leading-[1.02] tracking-tight md:text-7xl">
        {t(`titles.${project.slug}`)}
      </h1>
      <p className="max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-[17px]">
        {t(`summaries.${project.slug}`)}
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-foreground">{t("detail.stack_heading")}</span>
        {project.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {t("buttons.source", { ns: "common", defaultValue: "Source" })}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {t("buttons.live", { ns: "common", defaultValue: "Live" })}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <Hairline />
    </header>
  );
}
