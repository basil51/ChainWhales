import { AuthButton } from "@/components/auth-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white px-4 py-10 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-wide text-rose-500">
            ChainWhales.io
          </p>
          <h1 className="text-4xl font-semibold">
            Smart Money & Accumulation Tracker
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600">
            Real-time on-chain analytics platform that detects early accumulation
            signals across multiple blockchains. Get instant alerts when whales
            accumulate tokens.
          </p>
        </header>

        <div className="flex flex-col items-center gap-6">
          <AuthButton />
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-zinc-900">
              Real-time Detection
            </h3>
            <p className="text-sm text-zinc-600">
              Automatically identifies whale accumulation events, holder growth,
              and liquidity increases across multiple chains.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-zinc-900">Smart Filtering</h3>
            <p className="text-sm text-zinc-600">
              Advanced filters prevent false positives and scam tokens. Only
              high-quality signals with scores ≥70 are sent.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-zinc-900">Multi-Chain</h3>
            <p className="text-sm text-zinc-600">
              Currently tracking Solana, with Ethereum, BSC, Base, and more
              coming soon.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
