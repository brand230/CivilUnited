export interface PolymarketMarket {
  id: string;
  question: string;
  slug: string;
  endDate: string;
  volume: number;
  liquidity: number;
  outcomes: string[];
  outcomePrices: string[];
  active: boolean;
  closed: boolean;
  tags?: string[];
  image?: string;
}

export interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  markets: PolymarketMarket[];
  volume: number;
  liquidity: number;
  tags?: string[];
  image?: string;
  endDate: string;
}

const GAMMA_API = "https://gamma-api.polymarket.com";

export async function fetchTopMarkets(limit = 20): Promise<PolymarketMarket[]> {
  const url = `${GAMMA_API}/markets?active=true&closed=false&limit=${limit}&order=volume24hr&ascending=false`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchTopEvents(limit = 20): Promise<PolymarketEvent[]> {
  const url = `${GAMMA_API}/events?active=true&closed=false&limit=${limit}&order=volume24hr&ascending=false`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function parsePrice(price: string | number): number {
  const n = typeof price === "string" ? parseFloat(price) : price;
  return isNaN(n) ? 0 : Math.round(n * 100);
}

export function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
