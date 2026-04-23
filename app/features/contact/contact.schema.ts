import { z } from "zod";

type MessageResolver = (key: string) => string;

const defaultMessages: Record<string, string> = {
  name_required: "Please share your name.",
  name_too_long: "That's a long name — please shorten it.",
  email_required: "Email is required.",
  email_invalid: "That doesn't look like a valid email.",
  subject_required: "Please add a short subject.",
  subject_too_long: "Please shorten the subject.",
  message_too_short: "Please write at least 10 characters.",
  message_too_long: "That's more than I can read in one go — please trim it.",
  honeypot: "Looks like a bot caught the honeypot.",
};

export function createContactSchema(t: MessageResolver = (key) => defaultMessages[key] ?? key) {
  return z.object({
    name: z.string().trim().min(2, t("name_required")).max(80, t("name_too_long")),
    email: z.string().trim().min(1, t("email_required")).email(t("email_invalid")),
    subject: z.string().trim().min(3, t("subject_required")).max(120, t("subject_too_long")),
    message: z.string().trim().min(10, t("message_too_short")).max(4000, t("message_too_long")),
    website: z.string().max(0, t("honeypot")).optional().or(z.literal("")),
  });
}

export const contactSchema = createContactSchema();

export type ContactInput = z.infer<ReturnType<typeof createContactSchema>>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;
