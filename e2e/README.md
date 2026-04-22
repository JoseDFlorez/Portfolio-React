# End-to-end tests

These Playwright specs run against a production build of the site:

```bash
pnpm build
pnpm test:e2e
```

The `webServer` option in `playwright.config.ts` boots `pnpm build && pnpm start`
and waits for port 3000. Install browsers once with
`pnpm exec playwright install chromium` if this is a fresh checkout.
