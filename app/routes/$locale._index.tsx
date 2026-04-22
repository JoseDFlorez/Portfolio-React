import type { Route } from "./+types/$locale._index";

import { HeroSection } from "~/features/home/components/hero-section";
import { CurrentlyStrip } from "~/features/home/components/currently-strip";
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
import {
  alternateLinks,
  buildMetaEntries,
} from "~/i18n/meta";

const SNAPSHOT_GROUPS = ["languages", "backend", "data"] as const;
const SNAPSHOT_CAP = 4;

export function meta({ data: loaderData, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  return [
    ...buildMetaEntries(loaderData.locale, "home"),
    ...alternateLinks(location.pathname),
  ];
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
  return (
    <>
      <HeroSection />
      <HomeCtaRow />
      <CurrentlyStrip />
      <FeaturedProjectsList projects={loaderData.featured} />
      <HomeAboutStrip />
      <HomeSkillsSnapshot rows={loaderData.snapshotRows} />
      <HomeContactCta />
    </>
  );
}
