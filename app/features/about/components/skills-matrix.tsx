import { useTranslation } from "react-i18next";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { skills } from "~/features/about/about.data";

export function SkillsMatrix() {
  const { t } = useTranslation("about");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <SectionNumeral
        numeral="004"
        label={t("skills_matrix.label")}
        suffix={t("skills_matrix.suffix")}
      />
      <Hairline className="my-10" />
      <Tabs defaultValue={skills[0]?.id ?? "languages"}>
        <TabsList className="flex h-auto flex-wrap justify-start gap-2 rounded-none border-b border-border bg-transparent p-0">
          {skills.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              className="rounded-none border border-transparent px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {t(`skills_labels.${group.id}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        {skills.map((group) => (
          <TabsContent key={group.id} value={group.id} className="mt-8 focus-visible:outline-none">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 font-heading text-xl font-light tracking-tight md:text-2xl">
              {group.items.map((item, idx) => (
                <li key={item} className="inline-flex items-baseline gap-2 text-foreground/85">
                  <span className="font-sans text-[10px] tabular-nums uppercase tracking-[0.22em] text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
