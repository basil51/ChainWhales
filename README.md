# ChainWhales

Core roadmap, backend, and algorithm assets for ChainWhales.io.

## Quickstart

```bash
# 1. Start Postgres on port 5434 and keep it running
docker compose up -d postgres

# 2. Install backend deps and run migrations (DATABASE_URL already provided in .env)
cd backend
pnpm install
pnpm prisma migrate deploy

# 3. Start the API
pnpm start:dev
```

The `algorithms/` folder contains the Python accumulation prototype. To push alerts into the backend:

```bash
cd algorithms
BITQUERY_API_KEY=... INTERNAL_API_BASE_URL=http://localhost:4000 \
  python -m chainwhales_algo.examples.run_once --config configs/sample_config.yaml
```

## Frontend (Next.js dashboard)

```bash
cd frontend
pnpm install
pnpm dev  # open http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL` if the backend lives on a different host/port.
