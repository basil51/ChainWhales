import { Alert, Token } from "@/lib/types";

interface AlertFeedProps {
  alerts: Alert[];
  tokens: Token[];
}

export function AlertFeed({ alerts, tokens }: AlertFeedProps) {
  if (!alerts.length) {
    return (
      <div className="rounded-xl border border-dashed border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
        No alerts yet. Once the Python engine runs with the Internal API sink
        you’ll see live signals here.
      </div>
    );
  }

  const tokenById = new Map(tokens.map((token) => [token.id, token]));

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const token = tokenById.get(alert.tokenId);
        return (
          <article
            key={alert.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <header className="flex items-center justify-between gap-3 text-sm text-zinc-500">
              <span className="font-semibold uppercase tracking-wide text-rose-500">
                {alert.signalStrength} signal
              </span>
              <time dateTime={alert.createdAt}>
                {new Date(alert.createdAt).toLocaleString()}
              </time>
            </header>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-zinc-900">
                {token?.name ?? "Unknown Token"}
              </h3>
              <p className="text-sm text-zinc-500">
                Score {alert.score.toFixed(1)} ·{" "}
                {token?.chain?.toUpperCase() ?? "n/a"}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
              {token && (
                <>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    Liquidity ${token.liquidityUsd.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    24h Vol ${token.volumeUsd24h.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">
                    Holders {token.holderCount.toLocaleString()}
                  </span>
                </>
              )}
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                Delivery: {alert.deliveryTargets.join(", ")}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

