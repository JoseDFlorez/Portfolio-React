import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { profile } from "~/features/about/about.data";
import { useScrollReveal } from "~/lib/motion";

export function ContactSocials() {
  const { t } = useTranslation("contact");
  const scopeRef = useRef<HTMLElement>(null);
  const [emailLocalPart, emailDomain] = profile.email.split("@");
  const items = [
    {
      label: t("socials.email"),
      href: `mailto:${profile.email}`,
      handle: profile.email,
    },
    { label: t("socials.github"), href: profile.github, handle: "@JoseDFlorez" },
    {
      label: t("socials.linkedin"),
      href: profile.linkedin,
      handle: "/in/josedavidflorez",
    },
  ];
  useScrollReveal(scopeRef, "[data-contact-social]");

  return (
    <section ref={scopeRef} className="mx-auto max-w-7xl px-4 pb-24 md:px-8 lg:px-16">
      <ul className="grid gap-0 border-t border-border md:grid-cols-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
        {items.map((item) => (
          <li
            key={item.label}
            data-contact-social
            className="min-w-0 border-b border-border md:border-b-0 md:border-r md:last:border-r-0"
          >
            <a
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
              className="group flex h-full min-w-0 items-start justify-between gap-4 px-6 py-6 transition-colors hover:bg-secondary"
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 font-heading text-xl font-light leading-snug tracking-tight [overflow-wrap:anywhere] md:text-2xl">
                  {item.href.startsWith("mailto:") ? (
                    <>
                      {emailLocalPart}
                      <wbr />@{emailDomain}
                    </>
                  ) : (
                    item.handle
                  )}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="mt-5 shrink-0 font-sans text-sm text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:mt-6"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
