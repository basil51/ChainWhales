import { Token } from "@/lib/types";

interface TokenTableProps {
  tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
  if (!tokens.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
        No tokens yet. Run the accumulation engine to populate this list.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50 text-left font-semibold text-zinc-600">
          <tr>
            <th className="px-4 py-3">Token</th>
            <th className="px-4 py-3">Chain</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Liquidity</th>
            <th className="px-4 py-3">24h Volume</th>
            <th className="px-4 py-3">Holders</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {tokens.map((token) => (
            <tr key={token.id} className="text-zinc-800">
              <td className="px-4 py-3">
                <div className="font-medium">{token.name}</div>
                <div className="text-xs uppercase text-zinc-500">
                  {token.symbol}
                </div>
              </td>
              <td className="px-4 py-3 capitalize">{token.chain}</td>
              <td className="px-4 py-3 font-semibold">{token.score}</td>
              <td className="px-4 py-3 capitalize">{token.riskLevel}</td>
              <td className="px-4 py-3">
                ${token.liquidityUsd.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                ${token.volumeUsd24h.toLocaleString()}
              </td>
              <td className="px-4 py-3">{token.holderCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

