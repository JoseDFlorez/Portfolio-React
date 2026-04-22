import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import type { BuildInfo } from "~/lib/build-info.server";

type Props = { build: BuildInfo };

export function SystemLedger({ build }: Props) {
  const { t } = useTranslation("common");
  const location = useLocation();
  const year = new Date().getFullYear();
  const line = [
    `${t("ledger.commit")}=${build.sha}`,
    `${t("ledger.built")}=${build.commitDate}`,
    `${t("ledger.route")}=${location.pathname}`,
    `${t("ledger.tz")}=${build.tz}`,
    `© ${year} José Flórez`,
  ].join(" · ");

  return (
    <pre className="overflow-x-auto whitespace-nowrap border-t border-dashed border-border bg-transparent px-4 py-3 font-sans text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:px-8 lg:px-16">
      {line}
    </pre>
  );
}
