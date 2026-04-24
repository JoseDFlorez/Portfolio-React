import { projectSchema, type Project, type ProjectCategory } from "./projects.schema";

const raw: Project[] = [
  {
    slug: "spacex-explorer",
    category: "mobile",
    stack: ["Kotlin", "Jetpack Compose", "Hilt", "Coroutines", "SpaceX API v4"],
    year: 2025,
    thumbnail: "/img/projects/spacex-explorer-placeholder.svg",
    github: "https://github.com/JoseDFN/SpaceX-Explorer-App",
    featured: true,
  },
  {
    slug: "sgci-app",
    category: "backend",
    stack: [".NET Core", "C#", "CLI", "Clean Architecture"],
    year: 2024,
    thumbnail: "/img/projects/sgci-app.png",
    github: "https://github.com/JoseDFN/SGCI-app",
    featured: true,
  },
  {
    slug: "campuslove",
    category: "backend",
    stack: ["C#", "PostgreSQL", "Console App"],
    year: 2024,
    thumbnail: "/img/projects/campuslove.png",
    github: "https://github.com/JoseDFN/CampusLove",
    featured: false,
  },
  {
    slug: "todo-list-flask",
    category: "fullstack",
    stack: ["Python", "Flask", "SQLite", "PythonAnywhere"],
    year: 2023,
    thumbnail: "/img/projects/todo-list-flask.png",
    github: "https://github.com/JoseDFN/Todo-list-Flask",
    liveUrl: "https://joseflorez.pythonanywhere.com/",
    featured: true,
  },
  {
    slug: "formula1-webcomponents",
    category: "frontend",
    stack: ["Web Components", "Three.js", "Bootstrap 5"],
    year: 2024,
    thumbnail: "/img/projects/formula1-webcomponents.png",
    github: "https://github.com/JoseDFN/Formula1",
    liveUrl: "https://formulaj1.netlify.app/",
    featured: true,
  },
];

export const projects = projectSchema.array().parse(raw);

const skillProjectRelations: Record<string, string[]> = {
  "asp.net core": ["sgci-app"],
  "c#": ["sgci-app", "campuslove"],
  "clean architecture": ["spacex-explorer", "sgci-app"],
  "console app": ["campuslove"],
  ctes: ["sgci-app"],
  dapper: ["sgci-app"],
  flask: ["todo-list-flask"],
  "git / gitflow": projects.map((p) => p.slug),
  "hexagonal architecture": ["sgci-app"],
  "html/css": ["formula1-webcomponents", "todo-list-flask"],
  javascript: ["formula1-webcomponents"],
  "jetpack compose": ["spacex-explorer"],
  kotlin: ["spacex-explorer"],
  migrations: ["sgci-app", "campuslove"],
  postgresql: ["sgci-app", "campuslove"],
  python: ["todo-list-flask"],
  pythonanywhere: ["todo-list-flask"],
  rbac: ["sgci-app"],
  sqlite: ["todo-list-flask"],
  sql: ["sgci-app", "campuslove", "todo-list-flask"],
  "stored functions": ["sgci-app"],
  "three.js": ["formula1-webcomponents"],
  "unit of work": ["sgci-app"],
  "web components": ["formula1-webcomponents"],
};

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugsForSkill(skill: string): string[] {
  const relation = skillProjectRelations[normalizeSkill(skill)] ?? [];
  const known = new Set(projects.map((p) => p.slug));
  return relation.filter((slug) => known.has(slug));
}

export function getProjectTitlesForSkill(
  skill: string,
  resolveTitle: (slug: string) => string,
): string[] {
  return getProjectSlugsForSkill(skill).map(resolveTitle);
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => b.year - a.year)
    .slice(0, 4);
}

export type ProjectFacets = {
  categories: { value: ProjectCategory; count: number }[];
  stacks: { value: string; count: number }[];
};

export function getProjectFacets(): ProjectFacets {
  const catCount = new Map<ProjectCategory, number>();
  const stackCount = new Map<string, number>();

  for (const p of projects) {
    catCount.set(p.category, (catCount.get(p.category) ?? 0) + 1);
    for (const s of p.stack) stackCount.set(s, (stackCount.get(s) ?? 0) + 1);
  }

  return {
    categories: Array.from(catCount.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    stacks: Array.from(stackCount.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)),
  };
}

export function getProjectSiblings(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? (projects[index - 1] ?? null) : null,
    next: index < projects.length - 1 ? (projects[index + 1] ?? null) : null,
  };
}
