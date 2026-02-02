// DeFiLlama API client for protocol TVL
const DEFILLAMA_API = "https://api.llama.fi/tvl";

export async function fetchProtocolTvl(slug) {
  if (!slug) {
    return null;
  }

  try {
    const response = await fetch(`${DEFILLAMA_API}/${slug}`, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.warn(`DeFiLlama API error for ${slug}: ${response.status}`);
      return null;
    }

    // DeFiLlama returns TVL as a plain number (in USD)
    const tvl = await response.json();

    if (typeof tvl !== "number" || isNaN(tvl)) {
      console.warn(`Invalid TVL response for ${slug}`);
      return null;
    }

    // Convert to millions for consistency with our data format
    return Math.round(tvl / 1_000_000);
  } catch (error) {
    console.warn(`Failed to fetch TVL for ${slug}:`, error.message);
    return null;
  }
}

export async function fetchAllProtocolTvls(protocols) {
  const results = await Promise.allSettled(
    protocols.map(async (protocol) => {
      const tvl = await fetchProtocolTvl(protocol.slug);
      return {
        id: protocol.id,
        tvl: tvl !== null ? tvl : protocol.tvl, // Fallback to static TVL
        isLive: tvl !== null,
      };
    })
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    // On failure, return static TVL
    return {
      id: protocols[index].id,
      tvl: protocols[index].tvl,
      isLive: false,
    };
  });
}
