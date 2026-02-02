import { NextResponse } from "next/server";
import { fetchBtcPriceFromCoinGecko } from "@/lib/api/coingecko";
import { fetchBtcPriceFromBinance } from "@/lib/api/binance";
import { FALLBACK_BTC_PRICE } from "@/lib/constants/protocols";

// Cache the price in memory for fallback
let cachedPrice = {
  price: FALLBACK_BTC_PRICE,
  source: "fallback",
  timestamp: 0,
};

export async function GET() {
  try {
    // Try CoinGecko first
    const priceData = await fetchBtcPriceFromCoinGecko();
    cachedPrice = priceData;

    return NextResponse.json(priceData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (coingeckoError) {
    console.warn("CoinGecko failed, trying Binance:", coingeckoError.message);

    try {
      // Fallback to Binance
      const priceData = await fetchBtcPriceFromBinance();
      cachedPrice = priceData;

      return NextResponse.json(priceData, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      });
    } catch (binanceError) {
      console.warn("Binance failed, using cache:", binanceError.message);

      // Return cached/fallback price
      const isCacheStale = Date.now() - cachedPrice.timestamp > 300000; // 5 min

      return NextResponse.json({
        ...cachedPrice,
        source: isCacheStale ? "fallback" : "cached",
        isStale: isCacheStale,
      }, {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      });
    }
  }
}
