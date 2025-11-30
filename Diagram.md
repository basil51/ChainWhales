# ChainWhales.io — Full End-to-End Architecture Diagram (Version 1)

> Diagram Type: Full End-to-End (executive + engineer view)

---

## Diagram (Mermaid)

```mermaid
flowchart LR
  subgraph Users[Users & Integrations]
    U1[Trader (Web)]
    U2[Trader (Mobile)]
    U3[Telegram]
    U4[API Clients]
  end

  subgraph Frontend[Frontend Layer]
    F1[Next.js App (Vercel/SSR)]
    F2[Static Assets / CDN]
  end

  subgraph Ingress[Edge & CDN]
    CDN[CDN / WAF]
    LB[Load Balancer / Traefik]
  end

  subgraph API[Backend API & Gateway]
    API[Node.js REST / GraphQL API]
    WS[WebSocket Gateway (Socket.io)]
    Auth[Auth Service (NextAuth/Clerk)]
    Billing[Billing (Stripe/Lemon Squeezy)]
  end

  subgraph Core[Core Services]
    Queue[BullMQ / Redis Queue]
    Cache[Redis Cache]
    Worker1[Ingestion Worker (Node/Python)]
    Worker2[Scoring Worker (Python)]
    Worker3[Alert Delivery Worker]
    Snapshot[Snapshot Service]
    Backtest[Backtesting Service]
  end

  subgraph Data[Persistence & Storage]
    PG[PostgreSQL]
    S3[S3 / Object Storage (snapshots, archives)]
    ES[ElasticSearch (optional) / Read Index]
  end

  subgraph ExternalAPIs[External Data & Services]
    BitQuery[BitQuery GraphQL]
    Streams[BitQuery Streams / WebSocket]
    Fallback1[Helius / Alchemy (RPC Fallback)]
    Moralis[Moralis / Covalent]
    Price[CoinGecko / Price Oracles]
    TelegramAPI[Telegram API]
    StripeAPI[Stripe]
    Sentry[Sentry]
    Prometheus[Prometheus + Grafana]
  end

  subgraph Infra[Infra & DevOps]
    Docker[Docker / Containers]
    K8s[Kubernetes (Optional)]
    CI[CI/CD (GitHub Actions)]
    Monitoring[Monitoring & Alerts]
  end

  %% User to Frontend
  U1 -->|HTTPS| CDN
  U2 -->|HTTPS| CDN
  U3 -->|Telegram messages| TelegramAPI
  U4 -->|API calls| LB

  %% Frontend to API
  CDN --> LB
  LB --> API
  F1 -->|REST / GraphQL| API
  F1 -->|WebSockets| WS

  %% API interactions
  API --> Auth
  API --> Billing
  API --> Cache
  API --> PG
  API --> ES
  API --> Queue
  WS --> Cache
  WS --> Queue

  %% Core service flows
  Queue --> Worker1
  Queue --> Worker2
  Queue --> Worker3
  Worker1 -->|ingest token data| Snapshot
  Worker1 -->|store trades| PG
  Worker1 --> BitQuery
  Worker1 --> Streams
  Worker1 --> Moralis
  Worker1 --> Fallback1
  Worker2 --> PG
  Worker2 --> ES
  Worker2 --> Snapshot
  Worker2 --> S3

  %% Alerting flows
  Worker3 --> WS
  Worker3 --> TelegramAPI
  Worker3 -->|email| Billing
  Worker3 --> PG

  %% Backtest & analytics
  Backtest --> S3
  Backtest --> PG
  Backtest --> ES

  %% Observability & infra
  API --> Sentry
  Worker1 --> Sentry
  Worker2 --> Sentry
  Worker3 --> Sentry
  Prometheus --> Monitoring
  CI --> Docker
  Docker --> K8s
  K8s --> API
  K8s --> Worker1
  K8s --> Worker2
  K8s --> Worker3

  %% Data flows to external price & APIs
  BitQuery -->|GraphQL responses| Worker1
  Streams -->|Real-time events| Worker1
  Moralis -->|fallback| Worker1
  Fallback1 -->|RPC| Worker1
  Price -->|market prices| Worker1

  %% API usage logging
  Worker1 -->|api usage metrics| API
  API -->|record| PG
  API --> api_usage[api_usage table]

  style Users fill:#fef3c7,stroke:#f59e0b
  style Frontend fill:#ecfeff,stroke:#06b6d4
  style API fill:#eef2ff,stroke:#6366f1
  style Core fill:#f0f9ff,stroke:#0284c7
  style Data fill:#f8fafc,stroke:#0ea5a4
  style ExternalAPIs fill:#fff7ed,stroke:#fb923c
  style Infra fill:#f3f4f6,stroke:#9ca3af
```

---

## Diagram Notes & Component Descriptions

* **Users & Integrations** — Traders interact via web/mobile and Telegram; API clients included for advanced users.
* **Frontend** — Next.js app deployed on Vercel or a similar host; static assets behind CDN.
* **Ingress** — CDN and Load Balancer / Traefik handle TLS termination, routing.
* **API Layer** — Node.js REST/GraphQL service exposes endpoints for dashboard, ingestion control, user management. WebSocket gateway (Socket.io) manages real-time alerts.
* **Auth & Billing** — Use NextAuth/Clerk for authentication and Stripe or Lemon Squeezy for payments.
* **Core Workers** — BullMQ queue backed by Redis orchestrates ingestion workers (talking to BitQuery / RPC), scoring workers (Python engine), and alert delivery workers.
* **Snapshot Service** — Aggregates token stats periodically and writes snapshots to PostgreSQL and optionally S3.
* **Backtesting Service** — Runs periodic or on-demand historical simulations; stores results in `backtest_results` and S3.
* **Data Storage** — Postgres is primary; S3 for large archives; ElasticSearch for fast search/analytics (optional).
* **External APIs** — BitQuery is primary source; Streams used for real-time; Moralis/Alchemy/Helius are fallbacks; CoinGecko for prices.
* **Alert Delivery** — Alert worker pushes to WebSocket clients and Telegram, stores delivery records (`alert_deliveries`).
* **Observability** — Sentry for error tracking, Prometheus + Grafana for metrics. CI/CD pipelines use GitHub Actions to build and deploy Docker images.
* **Scaling** — Core workers are horizontally scalable; partitioning & sharding on DB recommended for large scale. Consider K8s for orchestration.

---

## Deployment Recommendations

* **Phase 1 (MVP)**: Keep infra simple. Use a single VPS or small cluster; run Node/Python workers as Docker containers; use managed Postgres (Supabase/RDS) or a small VPS Postgres. Use Redis managed or self-hosted.
* **Phase 2+**: Move to Kubernetes, managed DB, and scaled Redis. Add autoscaling groups for workers and API.
* **Cost control**: Keep scan frequency conservative (15–30 minutes) in MVP. Implement API usage monitor and automatic throttling.

---

## Next steps I can take for you

* Export this diagram as a PNG/SVG and produce a slide-ready image.
* Produce a second diagram showing **data flow timeline** (token ingestion → snapshot → scoring → alerting).
* Generate a **component-by-component implementation checklist** (Docker images, env vars, secrets, endpoints) for developers.

Which export or follow-up would you like next?
