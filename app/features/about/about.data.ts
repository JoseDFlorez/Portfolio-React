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
  dateRange: z.string().min(1),
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
    yearEnd: null,
    bulletCount: 6,
  },
];

const educationRaw: EducationEntry[] = [
  {
    id: "saint_leo",
    institution: "Saint Leo University",
    location: "Tampa, FL",
    dateRange: "Mar 2023 – May 2026",
    hasNotes: true,
  },
  {
    id: "campuslands",
    institution: "Campuslands",
    location: "Floridablanca, Colombia",
    dateRange: "Sept 2024 – June 2025",
    hasNotes: true,
  },
];

const skillsRaw: SkillGroup[] = [
  {
    id: "languages",
    items: ["C#", "Python", "JavaScript", "TypeScript", "HTML/CSS", "SQL", "Kotlin"],
  },
  {
    id: "backend",
    items: [
      "ASP.NET Core",
      "Dapper",
      "Unit of Work",
      "Flask",
      "Jetpack Compose",
      "Clean Architecture",
      "Hexagonal Architecture",
      "RBAC",
    ],
  },
  {
    id: "data",
    items: ["PostgreSQL", "Stored Functions", "CTEs", "Migrations", "MySQL", "SQLite"],
  },
  {
    id: "frontend",
    items: ["React", "React Router", "Tailwind CSS", "shadcn/ui", "Web Components", "Three.js"],
  },
  {
    id: "tooling",
    items: [
      "Git / GitFlow",
      "Docker",
      "PythonAnywhere",
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
  github: "https://github.com/JoseDFN",
  linkedin: "https://www.linkedin.com/in/josedavidflorez/",
  currentRole: {
    company: "Planeta IP Comunicaciones SAS ESP",
    title: "Full Stack Developer",
    since: "Oct 2025",
  },
} as const;
