import { NextResponse } from "next/server";
import { fetchAllProtocolTvls } from "@/lib/api/defillama";
import { PROTOCOL_CONFIG } from "@/lib/constants/protocols";

// Cache protocols in memory for fallback
let cachedProtocols = {
  protocols: PROTOCOL_CONFIG,
  timestamp: 0,
  liveCount: 0,
};

export async function GET() {
  try {
    // Fetch live TVL data for all protocols
    const tvlData = await fetchAllProtocolTvls(PROTOCOL_CONFIG);

    // Merge live TVL with static protocol data
    const protocols = PROTOCOL_CONFIG.map((protocol) => {
      const liveTvl = tvlData.find((t) => t.id === protocol.id);
      return {
        ...protocol,
        tvl: liveTvl?.tvl ?? protocol.tvl,
        tvlIsLive: liveTvl?.isLive ?? false,
      };
    });

    const liveCount = tvlData.filter((t) => t.isLive).length;

    // Update cache
    cachedProtocols = {
      protocols,
      timestamp: Date.now(),
      liveCount,
    };

    return NextResponse.json({
      protocols,
      timestamp: Date.now(),
      liveCount,
      totalCount: protocols.length,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Failed to fetch protocol data:", error);

    // Return cached data on error
    const isCacheStale = Date.now() - cachedProtocols.timestamp > 600000; // 10 min

    return NextResponse.json({
      protocols: cachedProtocols.protocols,
      timestamp: cachedProtocols.timestamp || Date.now(),
      liveCount: cachedProtocols.liveCount,
      totalCount: cachedProtocols.protocols.length,
      isStale: isCacheStale,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }
}
