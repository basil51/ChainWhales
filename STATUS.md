# ChainWhales — Project Status _(Nov 30, 2025)_

## Snapshot
- Phase 0 research prototype is ready for live data (BitQuery client, filters, scoring).
- Phase 1 backend (NestJS + Prisma + PostgreSQL @ `localhost:5434`) is online with real seed data.
- Internal ingestion endpoints are ready for the Python worker (`/internal/tokens`, `/internal/alerts`).

## Recently Completed
- Provisioned Dockerized Postgres (`chainwhales-postgres`, mapped to host port `5434`) and ran Prisma migrations + seeds.
- Added Prisma-backed services for tokens, alerts, and users (no more in-memory mocks).
- Created internal API client contract (`src/services/python-client.ts`) so the Python engine can POST signals directly.
- Scaffolded Clerk auth + Stripe billing modules and exposed `/billing/checkout`.
- Local `.env` now includes `DATABASE_URL`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and docker-compose keeps Postgres alive on `5434`.
- Bootstrapped a Next.js + Tailwind dashboard (`frontend/`) that consumes `/tokens` and `/alerts`.

## In Progress / Next
1. **Python integration:** run the accumulation engine with `InternalApiSink` / `src/services/python-client.ts` so fresh alerts flow continuously into `/tokens` + `/alerts`.
2. **Stripe catalog:** create price IDs for Basic/Pro/Whale (`STRIPE_PRICE_BASIC/PRO/WHALE`) and validate checkout/webhook flows.
3. **Frontend + auth:** start wiring the Next.js dashboard with Clerk-protected routes, live alert feeds, and subscription management.
4. **Monitoring:** add queue workers, health endpoints, and logging/metrics once the above pieces are live.

## Tracking
- Roadmap section **12. Current Status** now reflects this progress and pending actions.
- See `backend/prisma/seed.ts` for the baseline data that currently powers `/tokens` and `/alerts`.

