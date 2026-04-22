import { useTranslation } from "react-i18next";

import { Hairline } from "~/components/editorial/hairline";
import { SectionNumeral } from "~/components/editorial/section-numeral";

export type SkillsSnapshotRow = {
  id: string;
  label: string;
  items: string[];
};

export function HomeSkillsSnapshot({ rows }: { rows: SkillsSnapshotRow[] }) {
  const { t } = useTranslation("home");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <SectionNumeral
        numeral="003"
        label={t("skills.label")}
        suffix={t("skills.suffix")}
      />
      <Hairline className="mt-8" reveal />
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[auto,1fr] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[9rem,1fr] md:py-6"
          >
            <dt className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="font-sans text-sm leading-relaxed text-foreground md:text-[15px]">
              {row.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
      <Hairline />
    </section>
  );
}
