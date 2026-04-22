import { useTranslation } from "react-i18next";

import type { Project } from "~/features/projects/projects.schema";

export function ProjectGallery({ project }: { project: Project }) {
  const { t } = useTranslation("projects");
  const altText = t(`thumbnail_alt.${project.slug}`);
  return (
    <figure className="mt-12">
      <div className="relative aspect-16/10 w-full overflow-hidden border border-border bg-secondary">
        <img
          src={project.thumbnail}
          alt={altText}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ viewTransitionName: `project-${project.slug}` }}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-3 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {t("detail.plate_prefix")} · {project.slug}
      </figcaption>
    </figure>
  );
}
