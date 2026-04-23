import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Hairline } from "~/components/editorial/hairline";
import type { ProjectCategory } from "~/features/projects/projects.schema";

type Facet = { value: ProjectCategory; count: number };

export function ProjectsFilterBar({
  categories,
  totalCount,
}: {
  categories: Facet[];
  totalCount: number;
}) {
  const { t } = useTranslation("projects");
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("category") ?? "";

  function setCategory(value: string) {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete("category");
    } else {
      next.set("category", value);
    }
    setSearchParams(next, { preventScrollReset: true });
  }

  const shownCount = active ? countFor(active, categories, totalCount) : totalCount;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          § {t("filter.label")}
        </p>
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {active
            ? t("filter.count_filtered", { count: shownCount, total: totalCount })
            : t("filter.count_all", { count: totalCount })}
        </p>
      </div>
      <ToggleGroup
        type="single"
        value={active}
        onValueChange={(v) => setCategory(v ?? "")}
        className="flex flex-wrap justify-start gap-2"
      >
        <ToggleGroupItem
          value=""
          className="rounded-none border border-border px-3 py-1 font-sans text-[11px] uppercase tracking-[0.16em]"
        >
          {t("filter.all")} · {totalCount}
        </ToggleGroupItem>
        {categories.map((c) => (
          <ToggleGroupItem
            key={c.value}
            value={c.value}
            className="rounded-none border border-border px-3 py-1 font-sans text-[11px] uppercase tracking-[0.16em]"
          >
            {t(`categories.${c.value}`)} · {c.count}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Hairline className="mt-2" />
    </div>
  );
}

function countFor(active: string, categories: Facet[], totalCount: number): number {
  const match = categories.find((c) => c.value === active);
  return match?.count ?? totalCount;
}
