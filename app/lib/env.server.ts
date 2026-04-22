import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  RESEND_API_KEY: z.string().min(1).optional(),
  MAIL_FROM: z.string().email().optional(),
  MAIL_TO: z.string().email().optional(),
  COMMIT_SHA: z.string().optional(),
  SITE_URL: z.string().url().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

export const mailConfigured =
  Boolean(env.RESEND_API_KEY) && Boolean(env.MAIL_FROM) && Boolean(env.MAIL_TO);
