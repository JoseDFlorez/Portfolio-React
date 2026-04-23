import { useTranslation } from "react-i18next";

import { profile } from "~/features/about/about.data";

export function CurrentlyStrip() {
  const { t } = useTranslation("home");
  const parts = [
    t("currently.prefix"),
    profile.currentRole.company,
    profile.currentRole.title,
    `${profile.currentRole.since}${t("currently.since_suffix")}`,
  ];

  return (
    <div className="mx-auto max-w-7xl border-t border-b border-dashed border-border px-4 py-3 md:px-8 lg:px-16">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {parts.map((part, idx) => (
          <span key={idx} className="flex items-center gap-x-3">
            {idx > 0 ? (
              <span aria-hidden="true" className="text-border">
                ·
              </span>
            ) : (
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            )}
            <span className={idx === 0 ? "text-foreground" : undefined}>{part}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
