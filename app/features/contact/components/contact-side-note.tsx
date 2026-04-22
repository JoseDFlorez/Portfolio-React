import { useTranslation } from "react-i18next";

import { profile } from "~/features/about/about.data";

export function ContactSideNote() {
  const { t } = useTranslation("contact");
  const tz = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
    } catch {
      return "UTC";
    }
  })();
  return (
    <aside className="flex flex-col gap-6 border-l border-border pl-6 font-sans text-[12px] leading-relaxed text-muted-foreground md:pl-10">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-foreground/70">
          {t("side_note.response.heading")}
        </p>
        <p className="mt-2">{t("side_note.response.body")}</p>
      </div>
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-foreground/70">
          {t("side_note.location.heading")}
        </p>
        <p className="mt-2">
          {profile.location}
          <br />
          {t("side_note.location.working_hours")}: ({tz}).
        </p>
      </div>
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-foreground/70">
          {t("side_note.preferred.heading")}
        </p>
        <p className="mt-2">{t("side_note.preferred.body")}</p>
      </div>
    </aside>
  );
}
