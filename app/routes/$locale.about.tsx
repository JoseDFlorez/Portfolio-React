import type { Route } from "./+types/$locale.about";

import { AboutMasthead } from "~/features/about/components/about-masthead";
import { ExperienceTimeline } from "~/features/about/components/experience-timeline";
import { EducationList } from "~/features/about/components/education-list";
import { HowIWorkBlock } from "~/features/about/components/how-i-work-block";
import { SkillsMatrix } from "~/features/about/components/skills-matrix";
import { CvDownloadCta } from "~/features/about/components/cv-download-cta";
import { localeSchema } from "~/i18n/locale";
import { alternateLinks, buildMetaEntries } from "~/i18n/meta";

export function meta({ data: loaderData, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  return [
    ...buildMetaEntries(loaderData.locale, "about"),
    ...alternateLinks(location.pathname),
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return { locale: localeSchema.parse(params.locale) };
}

export default function AboutRoute() {
  return (
    <>
      <AboutMasthead />
      <ExperienceTimeline />
      <EducationList />
      <HowIWorkBlock />
      <SkillsMatrix />
      <CvDownloadCta />
    </>
  );
}
