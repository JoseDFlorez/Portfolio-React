import { useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/$locale.projects._index";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { ProjectsFilterBar } from "~/features/projects/components/projects-filter-bar";
import { ProjectsList } from "~/features/projects/components/projects-list";
import { ArchivedAccordion } from "~/features/projects/components/archived-accordion";
import { getProjectFacets, projects } from "~/features/projects/projects.data";
import { localeSchema } from "~/i18n/locale";
import { alternateLinks, buildMetaEntries } from "~/i18n/meta";
import { useTranslation } from "react-i18next";

export function meta({ data: loaderData, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  return [...buildMetaEntries(loaderData.locale, "projects"), ...alternateLinks(location.pathname)];
}

export async function loader({ params }: Route.LoaderArgs) {
  return {
    locale: localeSchema.parse(params.locale),
    projects,
    facets: getProjectFacets(),
  };
}

export default function ProjectsIndex({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation("projects");
  const [searchParams] = useSearchParams();
  const active = searchParams.get("category") ?? "";

  const visible = useMemo(() => {
    if (!active) return loaderData.projects;
    return loaderData.projects.filter((p) => p.category === active);
  }, [active, loaderData.projects]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <SectionNumeral numeral="001" label={t("list.label")} suffix={t("list.suffix")} />
      <h1 className="mt-6 max-w-4xl font-heading text-5xl font-light leading-[1.02] tracking-tight md:text-7xl">
        {t("list.h1")}
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
        {t("list.lede")}
      </p>
      <Hairline className="my-10" />
      <ProjectsFilterBar
        categories={loaderData.facets.categories}
        totalCount={loaderData.projects.length}
      />
      <div className="mt-4">
        <ProjectsList projects={visible} />
      </div>
      <div className="mt-16">
        <ArchivedAccordion />
      </div>
    </section>
  );
}
