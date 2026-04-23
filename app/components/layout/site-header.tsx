import { useEffect, useState } from "react";
import { FileDown, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { MonogramJF } from "~/components/editorial/monogram";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { LanguageSwitcher, LanguageSwitcherInline } from "~/components/layout/language-switcher";
import { cn } from "~/lib/utils";
import { useLocalePath } from "~/i18n/use-locale-path";

type NavItem = { to: string; labelKey: string; index?: boolean };

const NAV: NavItem[] = [
  { to: "/", labelKey: "nav.home", index: true },
  { to: "/about", labelKey: "nav.about" },
  { to: "/projects", labelKey: "nav.projects" },
  { to: "/contact", labelKey: "nav.contact" },
];

export function SiteHeader() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const localePath = useLocalePath();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8 lg:px-16">
        <NavLink
          to={localePath("/")}
          viewTransition
          className="group flex items-center gap-3"
          aria-label="José Flórez — home"
        >
          <MonogramJF className="text-foreground transition-colors group-hover:text-primary" />
          <span className="font-heading text-lg font-medium leading-none tracking-tight">
            José Flórez
          </span>
        </NavLink>

        <nav aria-label={t("nav.primary")} className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={localePath(item.to)}
              end={item.index}
              viewTransition
              className={({ isActive }) =>
                cn(
                  "relative font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(item.labelKey)}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-5.5 left-0 right-0 h-px bg-foreground"
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <LanguageSwitcher className="hidden md:inline-flex" />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("nav.open_menu")}
                className="rounded-none md:hidden"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm border-l border-border">
              <SheetHeader>
                <SheetTitle className="font-heading text-xl">{t("nav.menu_title")}</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6 px-4">
                {NAV.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <NavLink
                      to={localePath(item.to)}
                      end={item.index}
                      viewTransition
                      className={({ isActive }) =>
                        cn(
                          "font-heading text-3xl font-light tracking-tight text-muted-foreground transition-colors hover:text-foreground",
                          isActive && "text-foreground",
                        )
                      }
                    >
                      {t(item.labelKey)}
                    </NavLink>
                  </SheetClose>
                ))}
                <div className="mt-6 border-t border-dashed border-border pt-6">
                  <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {t("language_switcher.label")}
                  </p>
                  <LanguageSwitcherInline onSelect={() => setOpen(false)} />
                </div>
                <SheetClose asChild>
                  <a
                    href="/cv/jose-florez-cv.pdf"
                    download
                    className="mt-4 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    <FileDown className="size-3.5" />
                    {t("buttons.download_cv")}
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
