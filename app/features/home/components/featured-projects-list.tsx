import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

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
        <SectionNumeral numeral="001" label={t("featured.label")} suffix={t("featured.suffix")} />
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
      <div className="mt-10 overflow-hidden border border-border">
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          {projects.map((p, idx) => (
            <Link
              key={p.slug}
              to={localePath(`/projects/${p.slug}`)}
              viewTransition
              className="group relative flex min-h-55 flex-col justify-between gap-10 bg-background p-6 transition-colors duration-300 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-65 md:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.18em] text-muted-foreground">
                  00{idx + 1}
                </span>
                <span className="font-sans text-[11px] tabular-nums uppercase tracking-[0.18em] text-muted-foreground">
                  {p.year}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-2xl font-normal leading-tight md:text-[28px]">
                  {tp(`titles.${p.slug}`)}
                </h3>
                <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {tp(`categories.${p.category}`)} · {p.stack.slice(0, 3).join(" · ")}
                </p>
              </div>
              <ArrowUpRight
                className="size-4 self-end text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
