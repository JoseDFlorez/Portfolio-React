import { data } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/$locale.projects.$projectId";

import { ProjectHeader } from "~/features/projects/components/project-header";
import { ProjectGallery } from "~/features/projects/components/project-gallery";
import { ProjectNarrative } from "~/features/projects/components/project-narrative";
import { ProjectSiblingNav } from "~/features/projects/components/project-sibling-nav";
import {
  getProjectBySlug,
  getProjectSiblings,
  projects,
} from "~/features/projects/projects.data";
import { createI18nInstance } from "~/i18n/config";
import { localeSchema } from "~/i18n/locale";
import { alternateLinks, buildMetaEntries } from "~/i18n/meta";

const slugSchema = z.string().regex(/^[a-z0-9-]+$/);

export async function loader({ params }: Route.LoaderArgs) {
  const locale = localeSchema.parse(params.locale);
  const slugResult = slugSchema.safeParse(params.projectId);
  if (!slugResult.success) {
    throw data("Invalid project id.", { status: 404 });
  }
  const project = getProjectBySlug(slugResult.data);
  if (!project) {
    throw data("Project not found.", { status: 404 });
  }
  const index = projects.findIndex((p) => p.slug === project.slug);
  const siblings = getProjectSiblings(project.slug);
  return { locale, project, index, siblings };
}

export function meta({ data: loaderData, location }: Route.MetaArgs) {
  if (!loaderData) {
    return [{ title: "Project not found — José Flórez" }];
  }
  const instance = createI18nInstance(loaderData.locale);
  const title = instance.t(`titles.${loaderData.project.slug}`, {
    ns: "projects",
  }) as string;
  const description = instance.t(`summaries.${loaderData.project.slug}`, {
    ns: "projects",
  }) as string;
  return [
    ...buildMetaEntries(loaderData.locale, "project_not_found", {
      title: `${title} — José Flórez`,
      description,
    }),
    ...alternateLinks(location.pathname),
  ];
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <ProjectHeader project={loaderData.project} index={loaderData.index} />
      <ProjectGallery project={loaderData.project} />
      <ProjectNarrative project={loaderData.project} />
      <ProjectSiblingNav
        prev={loaderData.siblings.prev}
        next={loaderData.siblings.next}
      />
    </section>
  );
}
