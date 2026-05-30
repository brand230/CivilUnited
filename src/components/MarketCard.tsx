"use client";

import { PolymarketMarket, parsePrice, formatVolume } from "@/lib/polymarket";

interface Props {
  market: PolymarketMarket;
}

export default function MarketCard({ market }: Props) {
  const outcomes: string[] = Array.isArray(market.outcomes)
    ? market.outcomes
    : [];
  const prices: number[] = Array.isArray(market.outcomePrices)
    ? market.outcomePrices.map(parsePrice)
    : [];

  const yesIdx = outcomes.findIndex((o) => o.toLowerCase() === "yes");
  const noIdx = outcomes.findIndex((o) => o.toLowerCase() === "no");
  const yesOdds = yesIdx >= 0 ? prices[yesIdx] : null;
  const noOdds = noIdx >= 0 ? prices[noIdx] : null;

  const isBinary = yesOdds !== null && noOdds !== null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3 hover:border-brand-500 transition-colors">
      <p className="text-sm font-medium text-gray-100 leading-snug line-clamp-3">
        {market.question}
      </p>

      {isBinary ? (
        <div className="flex gap-2">
          <OddsChip label="Yes" pct={yesOdds!} color="green" />
          <OddsChip label="No" pct={noOdds!} color="red" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {outcomes.slice(0, 4).map((o, i) => (
            <OddsChip
              key={o}
              label={o}
              pct={prices[i] ?? 0}
              color="blue"
            />
          ))}
        </div>
      )}

      {isBinary && (
        <div className="relative h-2 rounded-full bg-red-900/60 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${yesOdds}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-1">
        {market.volume > 0 && (
          <span>Vol {formatVolume(market.volume)}</span>
        )}
        {market.endDate && (
          <span>Ends {new Date(market.endDate).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}

function OddsChip({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: "green" | "red" | "blue";
}) {
  const styles = {
    green: "bg-green-900/50 text-green-400 border-green-800",
    red: "bg-red-900/50 text-red-400 border-red-800",
    blue: "bg-blue-900/50 text-blue-400 border-blue-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${styles[color]}`}
    >
      {label}
      <span className="opacity-90">{pct}%</span>
    </span>
  );
}
