import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { ProjectRow } from "./project-row";
import type { Project } from "~/features/projects/projects.schema";
import { useScrollReveal } from "~/lib/motion";

export function ProjectsList({ projects }: { projects: Project[] }) {
  const { t } = useTranslation("projects");
  const scopeRef = useRef<HTMLUListElement>(null);

  useScrollReveal(scopeRef, "[data-project-list-row]", [projects.map((p) => p.slug).join(",")]);

  if (projects.length === 0) {
    return (
      <p className="py-16 text-center font-sans text-sm text-muted-foreground">
        {t("list.empty", { defaultValue: "No projects match this filter." })}
      </p>
    );
  }
  return (
    <ul ref={scopeRef} className="divide-y divide-border">
      {projects.map((p, idx) => (
        <ProjectRow key={p.slug} project={p} index={idx} reveal />
      ))}
    </ul>
  );
}
