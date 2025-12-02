# ChainWhales — Project Status _(Dec 1, 2025)_

## Snapshot
- Phase 0 research prototype is ready for live data (BitQuery client, filters, scoring).
- Phase 1 backend (NestJS + Prisma + PostgreSQL @ `localhost:5434`) is online with real seed data.
- Internal ingestion endpoints are ready for the Python worker (`/internal/tokens`, `/internal/alerts`), and a continuous Python loop can now push live alerts into them.
- **✅ Development environment fully operational:** All services (backend, frontend, Python engine) start without errors via `pnpm dev`.

## Recently Completed
- **✅ Verified End-to-End Pipeline:** Confirmed real-time signals flow from BitQuery -> Python Engine -> NestJS Backend -> WebSockets -> Next.js Dashboard.
- **✅ Fixed Algorithm Logic:** Updated `BitQueryClient` to correctly aggregate trades into token snapshots and respect query limits.
- **✅ Tuned Detection:** Adjusted dev/test configuration thresholds to ensure signals are generated for testing purposes.
- **✅ Alerts Dashboard Finalized:** `/app` now shows new alerts in real time, auto-updates via WebSockets, and has been manually tested with live signals.
- Provisioned Dockerized Postgres (`chainwhales-postgres`, mapped to host port `5434`) and ran Prisma migrations + seeds.
- Added Prisma-backed services for tokens, alerts, and users (no more in-memory mocks).
- Created internal API client contract (`src/services/python-client.ts`) so the Python engine can POST signals directly.
- Scaffolded Clerk auth + Stripe billing modules and exposed `/billing/checkout`.
- Local `.env` now includes `DATABASE_URL`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and docker-compose keeps Postgres alive on `5434`.
- Bootstrapped a Next.js + Tailwind dashboard (`frontend/`) that consumes `/tokens` and `/alerts`.
- Added a continuous accumulation loop runner (`algorithms/chainwhales_algo/examples/run_loop.py`) so the Python engine can stream alerts into the backend on an interval.
- **✅ Fixed dev environment issues:**
  - Updated dev script to use `python3` and set `PYTHONPATH=./src` for Python module resolution
  - Fixed Next.js 16 async headers() compatibility with Clerk by using client-side auth components
  - Moved Clerk middleware to `frontend/src/middleware.ts` (required for projects with `src/` directory)
  - Configured `turbopack.root` in Next.js config to silence lockfile warnings
  - Set up root `.env` file sourcing in dev script for `BITQUERY_API_KEY` environment variable

## In Progress / Next
1. **Stripe catalog:** create price IDs for Basic/Pro/Whale (`STRIPE_PRICE_BASIC/PRO/WHALE`) and validate checkout/webhook flows.
2. **Subscriptions wiring:** sync Stripe subscriptions into the backend `User.plan` field and expose current plan to the frontend.
3. **Frontend + auth:** show real plan status and limits in `/app` and `/app/subscription` (pricing UI and real-time alerts are already implemented).
4. **Monitoring:** add queue workers, health endpoints, and logging/metrics once the above pieces are live.

## Tracking
- Roadmap section **12. Current Status** now reflects this progress and pending actions.
- See `backend/prisma/seed.ts` for the baseline data that currently powers `/tokens` and `/alerts`.

