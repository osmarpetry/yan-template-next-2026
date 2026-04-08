# yan-template-next-2026

Reusable Next.js 16 starter for client-heavy product apps that need:

- Tailwind v4 semantic design tokens generated from TypeScript
- a custom Node server from day one
- Socket.IO for live progress streams
- Vitest + React Testing Library for FE/BE unit tests
- API integration tests against the running app server
- Playwright BDD with real `.feature` files
- Storybook with token documentation
- `plop` generators for common scaffolds

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm test:api`
- `pnpm test:e2e`
- `pnpm test:storybook`
- `pnpm test`
- `pnpm storybook`
- `pnpm build-storybook`
- `pnpm generate:component`
- `pnpm generate:server-module`
- `pnpm generate:feature`

## Runtime Notes

- The app uses `server.ts` to boot Next and attach Socket.IO.
- The sample domain is `tasks`, not an app-specific flow.
- The template ships with an in-memory task manager to demonstrate HTTP + websocket state recovery.
- The targeted baseline is Node 24 LTS. The current workspace can still run it on Node 25 during development.
