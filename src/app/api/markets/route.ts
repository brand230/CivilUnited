import { NextResponse } from "next/server";
import { fetchTopMarkets } from "@/lib/polymarket";

export const revalidate = 60;

export async function GET() {
  try {
    const markets = await fetchTopMarkets(30);
    return NextResponse.json(markets);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
