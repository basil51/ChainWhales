# ChainWhales

Core roadmap, backend, and algorithm assets for ChainWhales.io.

## Quickstart

```bash
# 1. Start Postgres on port 5434 and keep it running
docker compose up -d postgres

# 2. Install dependencies (from project root)
pnpm install

# 3. Run database migrations
cd backend
pnpm prisma migrate deploy
cd ..

# 4. Set up environment variables
# Make sure backend/.env has:
#   - DATABASE_URL
#   - BITQUERY_API_KEY (for Python engine)
#   - CLERK_SECRET_KEY, STRIPE_SECRET_KEY (optional for MVP)
#
# Make sure frontend/.env.local has (or create it):
#   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... (from Clerk dashboard)

# 5. Start everything (backend + frontend + Python engine)
# From project root:
pnpm dev
```

This will start:
- **Backend** (NestJS) on `http://localhost:4000`
- **Frontend** (Next.js) on `http://localhost:3000`
- **Python engine** (accumulation scanner) pushing alerts every 10 minutes

To run without the Python engine (backend + frontend only):
```bash
pnpm dev:no-python
```

### Manual Python engine (optional)

If you want to run the Python engine separately:

```bash
cd algorithms
BITQUERY_API_KEY=... INTERNAL_API_BASE_URL=http://localhost:4000 \
  python -m chainwhales_algo.examples.run_loop --config configs/sample_config.yaml
```

## Stripe billing setup

Stripe is already wired into the backend via the `BillingService` and `/billing/checkout`.
You still need to create products/prices in your Stripe dashboard and set the
corresponding environment variables.

1. **In the Stripe dashboard**
   - Create a **product** for each plan: `Basic`, `Pro`, `Whale`.
   - For each product, create a **recurring price** (e.g. monthly) with the target USD amount.
   - **Important:** Copy the **Price ID** (starts with `price_...`), NOT the Product ID (starts with `prod_...`).
   - You can find the Price ID by clicking on the product → viewing its prices → the ID is shown next to each price.

2. **In `backend/.env`**
   - Set the secret key: `STRIPE_SECRET_KEY=sk_live_or_test_xxx`.
   - Map your price IDs:
     - `STRIPE_PRICE_BASIC=price_xxx_for_basic`
     - `STRIPE_PRICE_PRO=price_xxx_for_pro`
     - `STRIPE_PRICE_WHALE=price_xxx_for_whale`
   - Optionally override redirect URLs:
     - `STRIPE_SUCCESS_URL=http://localhost:3000/app/success`
     - `STRIPE_CANCEL_URL=http://localhost:3000/app/cancel`

3. **Test checkout**
   - Start the backend (`pnpm start:dev` in `backend/` or `pnpm dev` from root).
   - Call `POST /billing/checkout` with a JSON body. You can use any email address (Stripe will create a customer with it), or use the seeded user's email:

     ```bash
     # Using the seeded user email (from prisma/seed.ts)
     curl -X POST http://localhost:4000/billing/checkout \
       -H "Content-Type: application/json" \
       -d '{"customerEmail":"founder@chainwhales.io","plan":"basic"}'
     
     # Or use any email for testing
     curl -X POST http://localhost:4000/billing/checkout \
       -H "Content-Type: application/json" \
       -d '{"customerEmail":"test@example.com","plan":"basic"}'
     ```

   - The response should include a Stripe Checkout Session with a `url` you can open in the browser.
   - **Note:** The seeded database includes a user with email `founder@chainwhales.io` (see `backend/prisma/seed.ts`), but the checkout email doesn't need to match an existing user - Stripe will handle customer creation.

## Frontend (Next.js dashboard)

```bash
cd frontend
pnpm install
pnpm dev  # open http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL` if the backend lives on a different host/port.

## Clerk Authentication Setup

Clerk is integrated for user authentication. To enable it:

1. **Create a Clerk account** at https://clerk.com (free tier available)

2. **Create an application** in the Clerk dashboard

3. **Get your API keys:**
   - **Publishable Key** (starts with `pk_test_...` or `pk_live_...`)
   - **Secret Key** (starts with `sk_test_...` or `sk_live_...`)

4. **Set environment variables:**
   - In `frontend/.env.local` (create if it doesn't exist):
     ```bash
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     ```
   - In `backend/.env`:
     ```bash
     CLERK_SECRET_KEY=sk_test_...
     ```

5. **Configure Clerk redirect URLs** in the Clerk dashboard:
   - After sign-in: `http://localhost:3000/app`
   - After sign-up: `http://localhost:3000/app`

Once configured, users can:
- Sign up at `/sign-up`
- Sign in at `/sign-in`
- Access protected dashboard at `/app`
- Manage subscription at `/app/subscription`
