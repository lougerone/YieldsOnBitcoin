"use client";

import useSWR from "swr";
import { PROTOCOL_CONFIG } from "@/lib/constants/protocols";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useProtocols() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/api/protocols",
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      fallbackData: {
        protocols: PROTOCOL_CONFIG,
        timestamp: Date.now(),
        liveCount: 0,
        totalCount: PROTOCOL_CONFIG.length,
      },
    }
  );

  // Determine data status for visual indicator
  const status = error
    ? "offline"
    : data?.liveCount === 0 || data?.isStale
      ? "cached"
      : "live";

  return {
    protocols: data?.protocols ?? PROTOCOL_CONFIG,
    timestamp: data?.timestamp,
    liveCount: data?.liveCount ?? 0,
    totalCount: data?.totalCount ?? PROTOCOL_CONFIG.length,
    status,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
