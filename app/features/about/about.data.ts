import { z } from "zod";

const experienceEntrySchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  yearStart: z.number().int().min(2000).max(2100),
  yearEnd: z.number().int().min(2000).max(2100).nullable(),
  bulletCount: z.number().int().min(1),
});

export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;

const educationEntrySchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  hasNotes: z.boolean(),
});

export type EducationEntry = z.infer<typeof educationEntrySchema>;

const skillGroupSchema = z.object({
  id: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;

const howIWorkIndexSchema = z.object({
  index: z.number().int().min(0),
});

export type HowIWorkEntry = z.infer<typeof howIWorkIndexSchema>;

const experienceRaw: ExperienceEntry[] = [
  {
    id: "planeta_ip",
    company: "Planeta IP Comunicaciones SAS ESP",
    location: "Bucaramanga, Santander, Colombia",
    yearStart: 2025,
    yearEnd: 2026,
    bulletCount: 8,
  },
];

const educationRaw: EducationEntry[] = [
  {
    id: "saint_leo",
    institution: "Saint Leo University",
    location: "Tampa, FL",
    hasNotes: true,
  },
  {
    id: "campuslands",
    institution: "Campuslands",
    location: "Floridablanca, Colombia",
    hasNotes: true,
  },
];

const skillsRaw: SkillGroup[] = [
  {
    id: "languages",
    items: ["C#", "TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS", "Kotlin"],
  },
  {
    id: "frontend",
    items: ["React", "React Router", "Tailwind CSS", "Zod", "i18next", "Jetpack Compose"],
  },
  {
    id: "backend",
    items: [
      ".NET 8",
      "ASP.NET Core Web API",
      "REST APIs",
      "Dapper",
      "Entity Framework Core",
      "FluentValidation",
      "Swagger/OpenAPI",
      "Serilog",
      "Flask",
    ],
  },
  {
    id: "architecture",
    items: [
      "Clean Architecture",
      "SOLID",
      "Unit of Work",
      "JWT",
      "Refresh-token rotation",
      "RBAC",
      "Hierarchical authorization",
    ],
  },
  {
    id: "data",
    items: [
      "PostgreSQL 17",
      "Schema design",
      "Migrations",
      "Query optimization",
      "Stored functions",
      "CTEs",
      "MySQL",
      "SQLite",
    ],
  },
  {
    id: "tooling",
    items: [
      "Docker",
      "Git",
      "GitHub",
      "Jira",
      "Node.js",
      "Vercel",
      "Gemini API",
      "Vitest",
      "Playwright",
      "Claude Code",
      "Codex",
    ],
  },
];

const howIWorkRaw: HowIWorkEntry[] = [{ index: 0 }, { index: 1 }, { index: 2 }];

export const experience = experienceEntrySchema.array().parse(experienceRaw);
export const education = educationEntrySchema.array().parse(educationRaw);
export const skills = skillGroupSchema.array().parse(skillsRaw);
export const howIWork = howIWorkIndexSchema.array().parse(howIWorkRaw);

export const profile = {
  name: "José David Flórez Navarrete",
  location: "Bucaramanga, Santander, Colombia",
  email: "jose.david.florez.navarrete@gmail.com",
  phone: "+57 301 538 6058",
  github: "https://github.com/JoseDFlorez",
  linkedin: "https://www.linkedin.com/in/josedavidflorez/",
  latestExperience: experience[0]!,
} as const;
