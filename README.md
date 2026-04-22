# Jose David Florez Portfolio

Personal portfolio for Jose David Florez Navarrete, built as a server-rendered React Router app with bilingual routes, project case studies, a contact form, and production health checks.

## Stack

- React 19 and React Router 7 framework mode
- TypeScript
- Tailwind CSS 4 with shadcn/ui-style primitives
- i18next for English and Spanish content
- Vitest for unit tests
- Playwright for end-to-end tests
- Vercel React Router preset for deployment

## Routes

- `/` redirects to the preferred locale.
- `/en` and `/es` render the home page.
- `/en/about` and `/es/about` render the profile, experience, education, and skills.
- `/en/projects` and `/es/projects` list the project archive.
- `/en/projects/:projectId` and `/es/projects/:projectId` render project details.
- `/en/contact` and `/es/contact` render the contact form.
- `/api/health` returns a production health payload.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The app runs at `http://localhost:5173`.

## Environment

Create a local `.env` from `.env.example` and fill only the values you need.

```bash
NODE_ENV=development
RESEND_API_KEY=
MAIL_FROM="Portfolio <noreply@example.com>"
MAIL_TO=jose.david.florez.navarrete@gmail.com
COMMIT_SHA=
SITE_URL=http://localhost:5173
```

Without `RESEND_API_KEY`, the mail layer falls back to the local logger path in development.

## Quality Gates

Run type generation and TypeScript checks:

```bash
pnpm typecheck
```

Run unit tests:

```bash
pnpm test
```

Build for production:

```bash
pnpm build
```

Serve the production build locally:

```bash
pnpm start
```

Run end-to-end tests:

```bash
pnpm test:e2e
```

## Deployment

This app targets Vercel. It uses `@vercel/react-router` in `react-router.config.ts` and the Vercel server entry helper in `app/entry.server.tsx`, so the SSR routes, actions, and `/api/health` route can run as Vercel Functions.

Import the GitHub repository in Vercel and use:

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output directory: leave empty

Set these production environment variables in Vercel:

```bash
RESEND_API_KEY=
MAIL_FROM="Portfolio <noreply@example.com>"
MAIL_TO=jose.david.florez.navarrete@gmail.com
SITE_URL=https://your-domain.example
```

Optional build metadata:

```bash
COMMIT_SHA=
```

After each deploy, smoke test:

```bash
curl -I https://your-domain.example
curl https://your-domain.example/api/health
```

Rollback by promoting the last known good deployment in Vercel, then rerun the smoke checks.

## Notes

Do not deploy this repository root through GitHub Pages. This is an SSR React Router app, so GitHub Pages would only serve static files and would not run the contact action, health route, or server rendering.
