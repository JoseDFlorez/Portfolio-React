import { useRef } from "react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/$locale.contact";

import { SectionNumeral } from "~/components/editorial/section-numeral";
import { Hairline } from "~/components/editorial/hairline";
import { ContactForm } from "~/features/contact/components/contact-form";
import { ContactSocials } from "~/features/contact/components/contact-socials";
import { ContactSideNote } from "~/features/contact/components/contact-side-note";
import { createContactSchema, type ContactFieldErrors } from "~/features/contact/contact.schema";
import { sendContactEmail } from "~/lib/mail.server";
import { checkRateLimit, getClientKey } from "~/lib/rate-limit.server";
import { log } from "~/lib/logger.server";
import { localeSchema } from "~/i18n/locale";
import { alternateLinks, buildMetaEntries } from "~/i18n/meta";
import { createI18nInstance } from "~/i18n/config";
import {
  isInitialMotionEnabled,
  markMotionReady,
  motionQueries,
  prepareMotionTargets,
  setMotionEndState,
  useScopedGsap,
} from "~/lib/motion";

export function meta({ data: loaderData, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  return [...buildMetaEntries(loaderData.locale, "contact"), ...alternateLinks(location.pathname)];
}

export async function loader({ params }: Route.LoaderArgs) {
  return { locale: localeSchema.parse(params.locale) };
}

export async function action({ params, request }: Route.ActionArgs) {
  const locale = localeSchema.parse(params.locale);
  const t = createI18nInstance(locale).getFixedT(locale, "contact");

  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries());

  if (typeof raw.website === "string" && raw.website.trim().length > 0) {
    log.warn("contact.honeypot_triggered");
    return Response.json({ ok: true, id: "honeypot" });
  }

  const schema = createContactSchema((key) => t(`errors.${key}`));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldErrors: ContactFieldErrors = {};
    for (const [key, errors] of Object.entries(flat.fieldErrors)) {
      if (errors && errors.length > 0) {
        fieldErrors[key as keyof typeof fieldErrors] = errors[0];
      }
    }
    return Response.json({ ok: false, fieldErrors }, { status: 400 });
  }

  const limit = checkRateLimit(getClientKey(request));
  if (!limit.allowed) {
    return Response.json({ ok: false, formError: t("errors.rate_limit") }, { status: 429 });
  }

  const result = await sendContactEmail(parsed.data);
  if (!result.ok) {
    return Response.json({ ok: false, formError: t("errors.server_error") }, { status: 502 });
  }

  return Response.json({ ok: true, id: result.id });
}

export default function ContactRoute() {
  const { t } = useTranslation("contact");
  const scopeRef = useRef<HTMLElement>(null);

  useScopedGsap(scopeRef, (gsap) => {
    const root = scopeRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(motionQueries, (context) => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-contact-motion]", root);
      if (context.conditions?.reduceMotion || !isInitialMotionEnabled()) {
        markMotionReady(targets);
        setMotionEndState(gsap, targets);
        return;
      }

      prepareMotionTargets(gsap, targets, { opacity: 0, y: 18 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        clearProps: "transform,opacity,visibility",
      });
    });

    return () => mm.revert();
  });

  return (
    <>
      <section ref={scopeRef} className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-16">
        <div data-contact-motion>
          <SectionNumeral numeral="000" label={t("masthead.label")} suffix={t("masthead.suffix")} />
        </div>
        <h1
          data-contact-motion
          className="mt-6 max-w-4xl font-heading text-5xl font-light leading-[1.02] tracking-tight md:text-7xl"
        >
          <span className="block">{t("masthead.h1_line_1")}</span>
          <span className="block italic text-muted-foreground">{t("masthead.h1_line_2")}</span>
        </h1>
        <div data-contact-motion>
          <Hairline className="my-10" />
        </div>
        <div className="grid gap-12 md:grid-cols-[2fr,1fr] md:gap-16">
          <ContactForm />
          <ContactSideNote />
        </div>
      </section>
      <ContactSocials />
    </>
  );
}
