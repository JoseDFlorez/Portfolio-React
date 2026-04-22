import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route(":locale", "routes/$locale.tsx", [
    index("routes/$locale._index.tsx"),
    route("about", "routes/$locale.about.tsx"),
    route("projects", "routes/$locale.projects._index.tsx"),
    route("projects/:projectId", "routes/$locale.projects.$projectId.tsx"),
    route("contact", "routes/$locale.contact.tsx"),
  ]),
  route("api/health", "routes/api.health.ts"),
] satisfies RouteConfig;
