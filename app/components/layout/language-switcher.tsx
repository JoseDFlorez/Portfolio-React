import { Check, Languages } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SUPPORTED_LOCALES,
  pathWithoutLocale,
  type Locale,
} from "~/i18n/locale";
import { useLocale } from "~/i18n/use-locale-path";
import { cn } from "~/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation("common");
  const location = useLocation();
  const current = useLocale();
  const tail = pathWithoutLocale(location.pathname);
  const search = location.search ?? "";
  const hash = location.hash ?? "";

  function hrefFor(target: Locale) {
    const path = tail === "/" ? `/${target}` : `/${target}${tail}`;
    return `${path}${search}${hash}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("language_switcher.aria")}
          className={cn(
            "h-9 rounded-none px-2 font-sans text-[11px] uppercase tracking-[0.18em]",
            className,
          )}
        >
          <Languages className="mr-1.5 size-3.5" aria-hidden="true" />
          {current.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem] rounded-none">
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            asChild
            className="cursor-pointer font-sans text-xs uppercase tracking-[0.14em]"
            data-state={locale === current ? "selected" : "unselected"}
          >
            <Link to={hrefFor(locale)} viewTransition reloadDocument={false}>
              <span className="flex-1">{locale.toUpperCase()}</span>
              {locale === current ? (
                <Check className="size-3.5 text-primary" aria-hidden="true" />
              ) : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageSwitcherInline({
  onSelect,
}: {
  onSelect?: () => void;
}) {
  const location = useLocation();
  const current = useLocale();
  const tail = pathWithoutLocale(location.pathname);
  const search = location.search ?? "";
  const hash = location.hash ?? "";

  function hrefFor(target: Locale) {
    const path = tail === "/" ? `/${target}` : `/${target}${tail}`;
    return `${path}${search}${hash}`;
  }

  return (
    <div className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em]">
      {SUPPORTED_LOCALES.map((locale, idx) => (
        <span key={locale} className="flex items-center gap-2">
          {idx > 0 ? (
            <span aria-hidden="true" className="text-border">
              /
            </span>
          ) : null}
          <Link
            to={hrefFor(locale)}
            viewTransition
            onClick={onSelect}
            className={cn(
              "transition-colors hover:text-primary",
              locale === current ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
