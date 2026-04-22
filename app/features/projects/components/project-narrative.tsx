import { useTranslation } from "react-i18next";

import type { NarrativeBlock, Project } from "~/features/projects/projects.schema";

export function ProjectNarrative({ project }: { project: Project }) {
  const { t } = useTranslation("projects");
  const blocks = t(`narratives.${project.slug}`, {
    returnObjects: true,
    defaultValue: [] as NarrativeBlock[],
  }) as NarrativeBlock[];
  return (
    <article className="mx-auto mt-16 grid max-w-3xl gap-8">
      {blocks.map((block, idx) => (
        <NarrativeNode key={idx} block={block} />
      ))}
    </article>
  );
}

function NarrativeNode({ block }: { block: NarrativeBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <h2 className="font-heading text-3xl font-light tracking-tight md:text-4xl">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="font-sans text-[14px] leading-relaxed text-foreground/85 md:text-[15px]">
          {block.text}
        </p>
      );
    case "list":
      return (
        <div className="border-l border-border pl-6">
          {block.title ? (
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {block.title}
            </p>
          ) : null}
          <ul className="flex flex-col gap-2 font-sans text-[14px] leading-relaxed text-foreground/85 md:text-[15px]">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-px w-3 shrink-0 bg-foreground"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}
