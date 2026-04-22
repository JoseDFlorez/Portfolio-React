import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Hairline } from "~/components/editorial/hairline";
import type { Project } from "~/features/projects/projects.schema";
import { useLocalePath } from "~/i18n/use-locale-path";

export function ProjectSiblingNav({
  prev,
  next,
}: {
  prev: Project | null;
  next: Project | null;
}) {
  const { t } = useTranslation("projects");
  const localePath = useLocalePath();
  return (
    <nav aria-label="Project navigation" className="mt-24">
      <Hairline />
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          {prev ? (
            <Link
              to={localePath(`/projects/${prev.slug}`)}
              viewTransition
              className="group inline-flex flex-col gap-2"
            >
              <span className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <ArrowLeft
                  className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                {t("detail.sibling_prev")}
              </span>
              <span className="font-heading text-lg font-normal leading-tight md:text-xl">
                {t(`titles.${prev.slug}`)}
              </span>
            </Link>
          ) : null}
        </div>
        <div className="text-right">
          {next ? (
            <Link
              to={localePath(`/projects/${next.slug}`)}
              viewTransition
              className="group inline-flex flex-col gap-2"
            >
              <span className="inline-flex items-center gap-2 self-end font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("detail.sibling_next")}
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="font-heading text-lg font-normal leading-tight md:text-xl">
                {t(`titles.${next.slug}`)}
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
