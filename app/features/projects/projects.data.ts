import { projectSchema, type Project, type ProjectCategory } from "./projects.schema";

const raw: Project[] = [
  {
    slug: "spacex-explorer",
    category: "mobile",
    stack: ["Kotlin", "Jetpack Compose", "Hilt", "Coroutines", "SpaceX API v4"],
    year: 2025,
    thumbnail: "/img/projects/spacex-explorer-placeholder.svg",
    github: "https://github.com/JoseDFN",
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
    featured: false,
  },
];

export const projects = projectSchema.array().parse(raw);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured).slice(0, 3);
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
