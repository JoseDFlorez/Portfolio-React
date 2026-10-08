import type { Route } from "./+types/$locale._index";
import { useDelayedActiveValue } from "~/hooks/use-delayed-active-value";

import { HeroSection } from "~/features/home/components/hero-section";
import { LatestExperienceStrip } from "~/features/home/components/latest-experience-strip";
import { HomeCtaRow } from "~/features/home/components/home-cta-row";
import { FeaturedProjectsList } from "~/features/home/components/featured-projects-list";
import { HomeAboutStrip } from "~/features/home/components/home-about-strip";
import {
  HomeSkillsSnapshot,
  type SkillsSnapshotRow,
} from "~/features/home/components/home-skills-snapshot";
import { HomeContactCta } from "~/features/home/components/home-contact-cta";
import { getFeaturedProjects } from "~/features/projects/projects.data";
import { skills } from "~/features/about/about.data";
import { createI18nInstance } from "~/i18n/config";
import { localeSchema } from "~/i18n/locale";
import { alternateLinks, buildMetaEntries } from "~/i18n/meta";

const SNAPSHOT_GROUPS = ["languages", "frontend", "backend", "data"] as const;
const SNAPSHOT_CAP = 4;

export function meta({ data: loaderData, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  return [...buildMetaEntries(loaderData.locale, "home"), ...alternateLinks(location.pathname)];
}

export async function loader({ params }: Route.LoaderArgs) {
  const locale = localeSchema.parse(params.locale);
  const snapshotRows: SkillsSnapshotRow[] = SNAPSHOT_GROUPS.flatMap((id) => {
    const group = skills.find((s) => s.id === id);
    if (!group) return [];
    const instance = createI18nInstance(locale);
    const label = instance.t(`skills.groups.${group.id}`, { ns: "home" });
    return [
      {
        id: group.id,
        label,
        items: group.items.slice(0, SNAPSHOT_CAP),
      },
    ];
  });

  return {
    locale,
    featured: getFeaturedProjects(),
    snapshotRows,
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const skillInteraction = useDelayedActiveValue<string>();

  return (
    <>
      <HeroSection />
      <HomeCtaRow />
      <LatestExperienceStrip />
      <FeaturedProjectsList
        projects={loaderData.featured}
        activeSkill={skillInteraction.activeValue}
      />
      <HomeAboutStrip />
      <HomeSkillsSnapshot
        rows={loaderData.snapshotRows}
        activeSkill={skillInteraction.activeValue}
        onSkillActivate={skillInteraction.activate}
        onSkillDeactivate={skillInteraction.scheduleReset}
      />
      <HomeContactCta />
    </>
  );
}
