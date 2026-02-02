// Binance API client for BTC price (fallback)
const BINANCE_API = "https://api.binance.com/api/v3/ticker/price";

export async function fetchBtcPriceFromBinance() {
  const response = await fetch(
    `${BINANCE_API}?symbol=BTCUSDT`,
    {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  );

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.price) {
    throw new Error("Invalid response from Binance");
  }

  return {
    price: parseFloat(data.price),
    source: "binance",
    timestamp: Date.now(),
  };
}
