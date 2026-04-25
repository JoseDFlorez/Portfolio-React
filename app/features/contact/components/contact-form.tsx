import { useEffect, useMemo, useRef } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { createContactSchema, type ContactInput } from "~/features/contact/contact.schema";
import {
  isInitialMotionEnabled,
  markMotionReady,
  motionQueries,
  prepareMotionTargets,
  setMotionEndState,
  useScopedGsap,
} from "~/lib/motion";

type ActionData =
  | { ok: true; id: string }
  | { ok: false; fieldErrors?: Partial<Record<keyof ContactInput, string>>; formError?: string };

export function ContactForm() {
  const { t } = useTranslation("contact");
  const fetcher = useFetcher<ActionData>();
  const pending = fetcher.state !== "idle";
  const scopeRef = useRef<HTMLFormElement>(null);

  const schema = useMemo(() => createContactSchema((key) => t(`errors.${key}`)), [t]);

  const form = useForm<ContactInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        toast.success(t("toast.success"));
        form.reset();
      } else if (fetcher.data.formError) {
        toast.error(fetcher.data.formError);
      } else {
        toast.error(t("errors.generic"));
      }
    }
  }, [fetcher.state, fetcher.data, form, t]);

  function handleSubmit(data: ContactInput) {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("email", data.email);
    formData.set("subject", data.subject);
    formData.set("message", data.message);
    formData.set("website", data.website ?? "");
    fetcher.submit(formData, { method: "post" });
  }

  useScopedGsap(scopeRef, (gsap) => {
    const root = scopeRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(motionQueries, (context) => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-contact-form-field]", root);
      if (context.conditions?.reduceMotion || !isInitialMotionEnabled()) {
        markMotionReady(targets);
        setMotionEndState(gsap, targets);
        return;
      }

      prepareMotionTargets(gsap, targets, { opacity: 0, y: 12 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        delay: 0.16,
        clearProps: "transform,opacity,visibility",
      });
    });

    return () => mm.revert();
  });

  return (
    <Form {...form}>
      <form
        ref={scopeRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8"
        noValidate
      >
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">{t("form.honeypot_label")}</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("website")}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-contact-form-field>
              <FormLabel className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("form.name.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="name"
                  className="rounded-none border-0 border-b border-border bg-transparent px-0 font-heading text-xl tracking-tight focus-visible:border-primary focus-visible:ring-0 md:text-2xl"
                  placeholder={t("form.name.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem data-contact-form-field>
              <FormLabel className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("form.email.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  className="rounded-none border-0 border-b border-border bg-transparent px-0 font-heading text-xl tracking-tight focus-visible:border-primary focus-visible:ring-0 md:text-2xl"
                  placeholder={t("form.email.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem data-contact-form-field>
              <FormLabel className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("form.subject.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="rounded-none border-0 border-b border-border bg-transparent px-0 font-heading text-xl tracking-tight focus-visible:border-primary focus-visible:ring-0 md:text-2xl"
                  placeholder={t("form.subject.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem data-contact-form-field>
              <FormLabel className="font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("form.message.label")}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={6}
                  className="min-h-40 rounded-none border border-border bg-transparent px-4 py-3 font-sans text-[15px] leading-relaxed focus-visible:border-primary focus-visible:ring-0"
                  placeholder={t("form.message.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div data-contact-form-field className="flex items-center justify-end gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="rounded-none font-sans text-[12px] uppercase tracking-[0.2em]"
          >
            {pending ? (
              <>
                {t("form.submitting")}
                <ArrowRight className="ml-2 size-4 animate-pulse" aria-hidden="true" />
              </>
            ) : (
              <>
                {t("form.submit")}
                <Send className="ml-2 size-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
