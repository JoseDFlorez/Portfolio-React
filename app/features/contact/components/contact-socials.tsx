import { useTranslation } from "react-i18next";

import { profile } from "~/features/about/about.data";

export function ContactSocials() {
  const { t } = useTranslation("contact");
  const items = [
    {
      label: t("socials.email"),
      href: `mailto:${profile.email}`,
      handle: profile.email,
    },
    { label: t("socials.github"), href: profile.github, handle: "@JoseDFN" },
    {
      label: t("socials.linkedin"),
      href: profile.linkedin,
      handle: "/in/josedavidflorez",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8 lg:px-16">
      <ul className="grid gap-0 border-t border-border md:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.label}
            className="border-b border-border md:border-b-0 md:border-r md:last:border-r-0"
          >
            <a
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
              className="group flex items-center justify-between gap-4 px-6 py-6 transition-colors hover:bg-secondary"
            >
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 font-heading text-xl font-light tracking-tight md:text-2xl">
                  {item.handle}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="font-sans text-sm text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
