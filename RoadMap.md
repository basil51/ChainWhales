# ChainWhales.io — Final Project Roadmap (Polished Version)

### Multi‑Chain Smart Money & Accumulation Tracker

### Version: Final MVP Roadmap (2025–2026)

---

# **1. Project Overview**

ChainWhales.io is a real‑time on‑chain analytics platform that detects **early accumulation signals** across multiple blockchains using optimized blockchain data queries, smart filtering, and a custom scoring engine.

The system automatically identifies:

* Whale accumulation events
* Holder growth trends
* Liquidity increases
* Contract safety
* Token inflows/outflows

When strong accumulation is detected, the token is **instantly added to the database**, and alerts are sent to users in real time.

The platform is designed as a **SaaS product** with subscription-based plans for traders.

---

# **2. Why This Project Will Generate Income**

* Traders are always searching for **early and reliable buy signals**.
* Real-time accumulation detection gives a true competitive advantage.
* Subscription model provides stable recurring revenue.
* Low infrastructure & API costs at MVP level.
* Viral potential through Telegram/X crypto communities.

---

# **3. Supported Blockchains**

### **Phase 1 (MVP): 1 Blockchain**

* Solana **or** Ethereum (recommended: Solana for speed and low cost).

### **Phase 2 (Expansion): Add chains one-by-one**

* Ethereum (if not MVP)
* BNB Chain (BSC)
* Base
* Arbitrum
* Polygon

### **Phase 3:**

* Avalanche
* TON
* Sui
* Tron
* Blast

Launching with a single chain significantly accelerates MVP development and reduces API load.

---

# **4. System Architecture (Final Structure)**

### **Backend**

* NestJS (backend folder)
* Python (Algorithm engine)
* Redis (caching + queues)
* BullMQ (rate‑limited job queues)
* PostgreSQL (main database)

### **Frontend**

* Next.js (React) (frontend folder) + tailwindcss 
* Real-time dashboard (Socket.io)

### **Infrastructure**

* VPS (backend + workers)
* Vercel or VPS for frontend

### **APIs / Data Sources**

Primary:

* **BitQuery GraphQL** (free tier for MVP → paid later)

Backup:

* Moralis
* Covalent
* Public RPC nodes (fallback)

---

# **5. Core Features (Final MVP Specification)**

### ✔ **Real-time Accumulation Detection Engine**

* Runs on a configurable interval (5–30 minutes)
* Scans new tokens + existing tracked tokens
* Detects whale buys, holder growth, owner activity, liquidity shifts

### ✔ **False-Positive & Scam Filtering** (critical)

* Minimum liquidity: **$50K+**
* Minimum holders: **100+**
* Honeypot detection (contract analysis)
* Rug-pull pattern detection (liquidity removal >50%)
* Exclude tokens with fake volume

### ✔ **Signal Scoring System (0–100)**

Each alert receives a score based on:

* Whale buy volume (30%)
* Holder growth (25%)
* Liquidity changes (20%)
* Price/volume momentum (15%)
* Contract safety (10%)

### ✔ Send Alert if **score ≥ 70**

Prevents spam alerts and improves trust.

### ✔ **Alerts System**

* WebSocket real-time feed
* Email (optional)
* Telegram bot (Phase 2)

### ✔ **Token Profiles**

Each token added includes:

* Name, symbol, chain
* Liquidity
* Volume
* Holder count
* Whale transactions
* Risk score

### ✔ **User Accounts & Authentication**

* Login/register
* Manage subscription plan
* Alert filter settings

---

# **6. Development Timeline (Final + Realistic)**

---

## **Phase 0 — Pre‑Development (1 Week)**

**Goal:** Validate the algorithm before building the platform.

* Build Python prototype
* Test on historical data (last 30 days)
* Measure BitQuery cost per query
* Identify filters needed to reduce false positives
* Define scoring thresholds

**Deliverable:**

* Working algorithm with **>60% signal accuracy** in backtesting

---

## **Phase 1 — MVP (6–8 Weeks)**

### **Weeks 1–2: Backend Core**

* PostgreSQL schema (tokens, alerts, users)
* Redis setup (cache + job queue)
* BullMQ configuration
* Node.js API (REST + WebSockets)
* BitQuery integration (optimized queries)

### **Weeks 3–4: Algorithm Engine**

* Implement accumulation detection logic
* Implement anti-scam filters
* Implement 0–100 scoring system
* Save alerts & tokens to DB

### **Weeks 5–6: Frontend Dashboard**

* Next.js UI
* Token table + scoring
* Alerts page (auto-updated via sockets)
* User auth

### **Week 7: Testing**

* Load tests (API, queues)
* Manual alert review
* Tune scoring & filters

### **Week 8: Private Beta**

* Invite 50–100 real users
* Collect feedback
* Fix issues

---

## **Phase 2 — Multi-Chain Expansion (4–6 Weeks)**

Add 1 new chain at a time:

* Connect API
* Add chain-specific filters
* Update algorithm
* Update frontend selectors

Add backtesting dashboard:

* Historical results
* Accuracy metrics
* Daily/weekly win-rate charts

Add Telegram bot for alerts.

---

## **Phase 3 — Pro Features (2–3 Months)**

* Real-time BitQuery Streams integration
* Liquidity pool analytics
* Whale wallet tracking
* AI prediction layer (future trends)
* Portfolio alerts
* User-configurable scoring thresholds

---

## **Phase 4 — Community & Monetization Enhancements**

* Signal Marketplace (users share custom algorithms)
* Affiliate program
* Copy-trading integration
* Priority scanning for "Whale" tier users

---

# **7. Pricing Model (Final)**

| Plan      | Price | Features                                               |
| --------- | ----- | ------------------------------------------------------ |
| **Free**  | $0    | 5 alerts/day, 15-min delay                             |
| **Basic** | $39   | Real-time alerts, 1 chain                              |
| **Pro**   | $149  | All chains, unlimited alerts, Telegram bot, API access |
| **Whale** | $799  | Priority scanning, custom filters, fund-level tools    |

Add a 7‑day free trial on Basic → Higher conversion.

---

# **8. API Cost Strategy**

### **MVP Cost = $0** (BitQuery Free Tier)

Why this works:

* Single chain
* Scans every 10–30 min
* Optimized queries
* Redis caching
* Queue-controlled rate limiting

### **Scaling Cost (after 1,000+ users): $200–$1,000/mo**

Paid BitQuery plan when:

* Multi-chain
* Real-time streams
* High token coverage

---

# **9. Critical Risk Mitigation**

### 1. **False positives**

Solution: Conservative filters + scoring system

### 2. **API limits**

Solution: Queue + caching + multi-API fallback

### 3. **Legal concerns**

Solution: Platform-wide disclaimer: *"This is not financial advice."*

### 4. **Churn**

Solution: Backtesting page + accuracy statistics

---

# **10. Expected Revenue (Realistic)**

| Scenario    | Users | MRR      |
| ----------- | ----- | -------- |
| Pessimistic | 50    | ~$2,500  |
| Realistic   | 150   | ~$8,000  |
| Optimistic  | 500   | ~$40,000 |

---

# **11. Final Verdict**

This is a **fully optimized, realistic, and scalable roadmap** for your project.
It reduces initial complexity, ensures API costs remain near-zero, and focuses on delivering real trader value early.

You are now ready to begin development.

---

If you want, I can now:

* Generate a **database schema**,
* Write the **algorithm pseudocode**,
* Create the **BitQuery API queries**,
* Build your **backend folder structure**,
* Or produce a **frontend wireframe**.


will use pnpm not npm 

Just tell me which step you want next.

✅ Create a project architecture diagram
✅ Write the algorithm pseudocode
✅ Generate the full database schema
✅ Build the API rate-limited job queue design
✅ Create the next.js + backend folder structure

---

# **12. Current Status (Nov 30, 2025)**

* ✅ **Phase 0 prototype prepared:** Python accumulation engine scaffolded with BitQuery client, filters, and scoring (ready for data wiring).
* ✅ **Phase 1 Weeks 1–2 complete:** NestJS backend, Prisma/PostgreSQL (port `5434`), Redis-ready queue layer, and API endpoints for tokens, alerts, and users are running.
* ✅ **Internal ingestion endpoints live:** `/internal/tokens` and `/internal/alerts` accept validated payloads and persist to the database for the Python worker.
* ✅ **Prisma migrations & seed data:** Local Postgres seeded with baseline user/token/alert, confirming real responses from `/tokens` and `/alerts`.
* 🔄 **Next actions:** create a local `.env` with `DATABASE_URL`, `CLERK_*`, and `STRIPE_*` keys, keep the Postgres container running (or add to docker-compose), wire the Python engine to the new internal endpoints, and supply real Clerk & Stripe credentials for auth/billing launch.