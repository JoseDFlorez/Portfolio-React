import type { ReactNode } from "react";
import { SiteHeader } from "~/components/layout/site-header";
import { SiteFooter } from "~/components/layout/site-footer";
import { Toaster } from "~/components/ui/sonner";
import type { BuildInfo } from "~/lib/build-info.server";

export function SiteShell({ children, build }: { children: ReactNode; build: BuildInfo }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-none focus:bg-foreground focus:px-3 focus:py-2 focus:font-sans focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-background"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1" aria-live="polite">
        {children}
      </main>
      <SiteFooter build={build} />
      <Toaster position="bottom-right" />
    </div>
  );
}
