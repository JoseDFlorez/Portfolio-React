import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Hairline } from "~/components/editorial/hairline";
import { SectionNumeral } from "~/components/editorial/section-numeral";
import type { Project } from "~/features/projects/projects.schema";
import { useLocalePath } from "~/i18n/use-locale-path";

export function FeaturedProjectsList({ projects }: { projects: Project[] }) {
  const { t } = useTranslation("home");
  const { t: tp } = useTranslation("projects");
  const localePath = useLocalePath();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div className="flex items-end justify-between gap-4">
        <SectionNumeral
          numeral="001"
          label={t("featured.label")}
          suffix={t("featured.suffix")}
        />
        <Link
          to={localePath("/projects")}
          viewTransition
          className="group inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
        >
          {t("featured.all_projects")}
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
      <h2 className="mt-6 max-w-2xl font-heading text-3xl font-light leading-tight tracking-tight md:text-5xl">
        {t("featured.h2")}
      </h2>
      <Hairline className="mt-10" />
      <ul className="divide-y divide-border">
        {projects.map((p, idx) => (
          <li key={p.slug}>
            <Link
              to={localePath(`/projects/${p.slug}`)}
              viewTransition
              className="group grid grid-cols-[auto,1fr,auto] items-center gap-4 py-6 md:grid-cols-[auto,3fr,1fr,auto] md:gap-8"
            >
              <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.18em] text-muted-foreground">
                00{idx + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-xl font-normal md:text-2xl">
                  {tp(`titles.${p.slug}`)}
                </p>
                <p className="mt-1 truncate font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {tp(`categories.${p.category}`)} · {p.stack.slice(0, 3).join(" · ")}
                </p>
              </div>
              <span className="hidden font-sans text-[11px] tabular-nums uppercase tracking-[0.18em] text-muted-foreground md:inline">
                {p.year}
              </span>
              <ArrowUpRight
                className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
