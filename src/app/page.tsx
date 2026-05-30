import { fetchTopMarkets, formatVolume, type PolymarketMarket } from "@/lib/polymarket";
import MarketCard from "@/components/MarketCard";
import { Suspense } from "react";

export const revalidate = 60;

async function Markets() {
  let markets: PolymarketMarket[] = [];
  let error: string | null = null;

  try {
    markets = await fetchTopMarkets(30);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load markets";
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-900/30 border border-red-800 p-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No active markets found.</p>
    );
  }

  const totalVol = markets.reduce((s, m) => s + (m.volume ?? 0), 0);

  return (
    <>
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
        <span>{markets.length} active markets</span>
        <span className="text-gray-600">·</span>
        <span>Total volume: {formatVolume(totalVol)}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((m) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </div>
    </>
  );
}

export default function Home() {
  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
            Live
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">
          Polymarket Odds
        </h1>
        <p className="text-gray-400 text-sm">{now} · Top markets by 24h volume</p>
      </header>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-44 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <Markets />
      </Suspense>

      <footer className="mt-12 text-center text-xs text-gray-600">
        Data from{" "}
        <span className="text-gray-500">Polymarket</span> · Refreshes every 60s ·{" "}
        <span className="text-gray-500">Not financial advice</span>
      </footer>
    </main>
  );
}
