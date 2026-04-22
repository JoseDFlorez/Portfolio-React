import { ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { useLocalePath } from "~/i18n/use-locale-path";

export function HomeCtaRow() {
  const { t } = useTranslation("common");
  const localePath = useLocalePath();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-10 md:flex-row md:items-center md:gap-6 md:px-8 md:pb-16 lg:px-16">
      <Button
        asChild
        size="lg"
        className="rounded-none font-sans text-[12px] uppercase tracking-[0.2em]"
      >
        <Link to={localePath("/projects")} viewTransition>
          {t("buttons.view_projects")}
          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="rounded-none font-sans text-[12px] uppercase tracking-[0.2em]"
      >
        <Link to={localePath("/contact")} viewTransition>
          <MessageSquare className="mr-2 size-4" aria-hidden="true" />
          {t("buttons.get_in_touch")}
        </Link>
      </Button>
    </div>
  );
}
