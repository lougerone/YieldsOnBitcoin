"use client";

import useSWR from "swr";
import { FALLBACK_BTC_PRICE } from "@/lib/constants/protocols";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useBtcPrice() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/api/btc-price",
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // Dedupe requests within 30 seconds
      fallbackData: {
        price: FALLBACK_BTC_PRICE,
        source: "fallback",
        timestamp: Date.now(),
      },
    }
  );

  // Determine data status for visual indicator
  const status = error
    ? "offline"
    : data?.source === "fallback" || data?.isStale
      ? "cached"
      : "live";

  return {
    price: data?.price ?? FALLBACK_BTC_PRICE,
    source: data?.source ?? "fallback",
    timestamp: data?.timestamp,
    status,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
