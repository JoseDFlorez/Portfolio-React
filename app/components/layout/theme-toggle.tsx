import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useTheme, type Theme } from "~/hooks/use-theme";

type Option = { value: Theme; translationKey: string; Icon: typeof Sun };

const OPTIONS: Option[] = [
  { value: "light", translationKey: "theme.light", Icon: Sun },
  { value: "dark", translationKey: "theme.dark", Icon: Moon },
  { value: "system", translationKey: "theme.system", Icon: Monitor },
];

export function ThemeToggle() {
  const { t } = useTranslation("common");
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("theme.toggle")} className="rounded-none">
          <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("theme.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 rounded-none">
        {OPTIONS.map(({ value, translationKey, Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className="cursor-pointer font-sans text-xs uppercase tracking-[0.12em]"
            data-state={theme === value ? "selected" : "unselected"}
          >
            <Icon className="mr-2 size-3.5" />
            {t(translationKey)}
            {theme === value ? (
              <span aria-hidden="true" className="ml-auto text-primary">
                ·
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
