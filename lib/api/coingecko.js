// CoinGecko API client for BTC price
const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";

export async function fetchBtcPriceFromCoinGecko() {
  const response = await fetch(
    `${COINGECKO_API}?ids=bitcoin&vs_currencies=usd`,
    {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.bitcoin?.usd) {
    throw new Error("Invalid response from CoinGecko");
  }

  return {
    price: data.bitcoin.usd,
    source: "coingecko",
    timestamp: Date.now(),
  };
}
