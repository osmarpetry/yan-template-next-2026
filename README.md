# find-remote-for-me

Private remote job discovery dashboard for a Luxembourg-based senior frontend/full-stack engineer.

## Current Slice

- `/jobs` aggregates raw jobs from We Work Remotely, Remotive, HN Hiring, Landing.jobs, and selected Greenhouse, Lever, and Ashby company boards.
- Jobs are normalized into one comparable table.
- Search and source filtering happen client-side after the feed is loaded, including preset keyword clusters for common triage passes.
- Source-specific failures are isolated so one broken feed does not blank the page.

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
- The template's sample `tasks` domain is still present as reusable infrastructure example code, but the product-facing route for this slice is `/jobs`.
- The targeted baseline is Node 24 LTS. The current workspace can still run it on Node 25 during development.
