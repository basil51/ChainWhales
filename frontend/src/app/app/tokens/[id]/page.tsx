import { getAlerts, getToken } from "@/lib/api";
import { Alert } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TokenDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { id } = await params;
  let token;
  try {
    token = await getToken(id);
  } catch (error) {
    notFound();
  }

  const alerts = await getAlerts();
  const tokenAlerts: Alert[] = alerts.filter((a) => a.tokenId === token.id);

  return (
    <div className="px-4 py-10 text-zinc-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Link
          href="/app"
          className="text-sm text-zinc-500 hover:text-zinc-800 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-rose-500">
            Token overview
          </p>
          <h1 className="text-3xl font-semibold">
            {token.name} ({token.symbol})
          </h1>
          <p className="text-sm text-zinc-500">
            Chain: <span className="capitalize">{token.chain}</span> · Score{" "}
            <span className="font-semibold">{token.score.toFixed(1)}</span> ·
            Risk <span className="capitalize">{token.riskLevel}</span>
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
            <p className="text-zinc-500">Liquidity</p>
            <p className="mt-1 text-lg font-semibold">
              ${token.liquidityUsd.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
            <p className="text-zinc-500">24h Volume</p>
            <p className="mt-1 text-lg font-semibold">
              ${token.volumeUsd24h.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
            <p className="text-zinc-500">Holders</p>
            <p className="mt-1 text-lg font-semibold">
              {token.holderCount.toLocaleString()}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Recent alerts</h2>
          {tokenAlerts.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No alerts yet for this token.
            </p>
          ) : (
            <div className="space-y-3">
              {tokenAlerts.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 text-sm"
                >
                  <header className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-semibold uppercase tracking-wide text-rose-500">
                      {alert.signalStrength} signal
                    </span>
                    <time dateTime={alert.createdAt}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </time>
                  </header>
                  <p className="mt-2 text-sm text-zinc-600">
                    Score {alert.score.toFixed(1)} · Delivery:{" "}
                    {alert.deliveryTargets.join(", ")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


