import { z } from "zod";

export const projectCategorySchema = z.enum(["backend", "fullstack", "mobile", "frontend"]);

export type ProjectCategory = z.infer<typeof projectCategorySchema>;

const narrativeBlockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("heading"), text: z.string().min(1) }),
  z.object({ kind: z.literal("paragraph"), text: z.string().min(1) }),
  z.object({
    kind: z.literal("list"),
    title: z.string().optional(),
    items: z.array(z.string().min(1)).min(1),
  }),
]);

export type NarrativeBlock = z.infer<typeof narrativeBlockSchema>;

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  category: projectCategorySchema,
  stack: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(2000).max(2100),
  thumbnail: z.string().min(1),
  github: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export type Project = z.infer<typeof projectSchema>;
