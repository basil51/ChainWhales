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

## In Progress / Next
1. **Environment config:** create a local `.env` that includes `DATABASE_URL`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, and price IDs (`STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_WHALE`). _(File creation is blocked in this workspace, so add it manually.)_
2. **Database uptime:** keep the `chainwhales-postgres` container running or codify it via docker-compose so port `5434` always hosts Postgres.
3. **Python integration:** wire the accumulation engine to the new internal endpoints using `src/services/python-client.ts` as the contract.
4. **Credentials rollout:** provision real Clerk + Stripe keys to unlock authentication and subscription flows.
5. **Monitoring:** once env secrets exist, add health checks/metrics + queue workers.

## Tracking
- Roadmap section **12. Current Status** now reflects this progress and pending actions.
- See `backend/prisma/seed.ts` for the baseline data that currently powers `/tokens` and `/alerts`.

