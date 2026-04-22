import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { education } from "~/features/about/about.data";

export function EducationList() {
  const { t } = useTranslation("about");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <SectionNumeral
        numeral="002"
        label={t("education.label")}
        suffix={t("education.suffix")}
      />
      <Hairline className="my-10" />
      <ul className="flex flex-col gap-10">
        {education.map((entry) => {
          const credential = t(`education.${entry.id}.credential`);
          const program = t(`education.${entry.id}.program`);
          const notes = entry.hasNotes
            ? (t(`education.${entry.id}.notes`, {
                returnObjects: true,
                defaultValue: [] as string[],
              }) as string[])
            : [];
          return (
            <li
              key={`${entry.institution}-${entry.id}`}
              className="grid gap-6 md:grid-cols-[auto,1fr,auto] md:gap-10"
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:w-32">
                {credential}
              </p>
              <div>
                <h3 className="font-heading text-2xl font-normal tracking-tight">
                  {entry.institution}
                </h3>
                <p className="mt-1 font-sans text-[13px] text-muted-foreground">
                  {program} · {entry.location}
                </p>
                {notes.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-1 font-sans text-[13px] text-foreground/85">
                    {notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:text-right">
                {entry.dateRange}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
