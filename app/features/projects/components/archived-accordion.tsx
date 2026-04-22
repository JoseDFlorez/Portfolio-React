import { useTranslation } from "react-i18next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export function ArchivedAccordion() {
  const { t } = useTranslation("projects");
  const titles = t("archive.items", { returnObjects: true }) as string[];
  return (
    <Accordion type="single" collapsible className="border-t border-border">
      <AccordionItem value="archive" className="border-b border-border">
        <AccordionTrigger className="py-6 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground [&>svg]:text-muted-foreground">
          {t("archive.title")}
        </AccordionTrigger>
        <AccordionContent>
          <p className="pb-4 font-sans text-[12px] leading-relaxed text-muted-foreground">
            {t("archive.helper")}
          </p>
          <ul className="flex flex-col gap-2 py-2 font-sans text-sm text-muted-foreground">
            {titles.map((title) => (
              <li
                key={title}
                className="flex items-baseline justify-between gap-4"
              >
                <span>{title}</span>
                <span
                  aria-hidden="true"
                  className="flex-1 border-b border-dotted border-border"
                />
                <span className="font-sans text-[10px] uppercase tracking-[0.2em]">
                  Archived
                </span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
