import { useTranslation } from "react-i18next";

import { ProjectImage } from "~/features/projects/components/project-image";
import type { Project } from "~/features/projects/projects.schema";

export function ProjectGallery({ project }: { project: Project }) {
  const { t } = useTranslation("projects");
  const altText = t(`thumbnail_alt.${project.slug}`);
  return (
    <figure className="mt-12">
      <div className="relative aspect-16/10 w-full overflow-hidden border border-border bg-secondary">
        <ProjectImage
          project={project}
          alt={altText}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="(min-width: 1280px) 1152px, calc(100vw - 2rem)"
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
