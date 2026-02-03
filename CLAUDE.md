# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YieldsOnBitcoin is a Next.js React application for exploring Bitcoin yield protocols and building allocation strategies. Features live BTC price and protocol TVL data via API routes.

## Architecture

### File Structure
```
app/
  layout.jsx           # Root layout with metadata
  page.jsx             # Home page (marketing landing)
  explore/page.jsx     # Protocol explorer
  strategy/page.jsx    # Strategy builder
  allocate/page.jsx    # Allocation review (accepts ?strategy= or ?custom=1 params)
  protocol/[slug]/page.jsx  # Dynamic protocol detail pages
  api/
    btc-price/route.js     # BTC price endpoint (CoinGecko/Binance fallback)
    protocols/route.js     # Protocol TVL data (DeFiLlama API)
lib/
  constants/protocols.js   # Protocol configs, categories, strategies
  hooks/
    useBtcPrice.js         # SWR hook for live BTC price
    useProtocols.js        # SWR hook for protocol data with live TVL
  api/
    coingecko.js           # CoinGecko price fetcher
    binance.js             # Binance fallback fetcher
    defillama.js           # DeFiLlama TVL fetcher
  data/
    protocol-research.md   # Research notes on protocols
    new-protocols-research.md
yieldsonbitcoin.jsx        # Main application component (~1100 lines)
```

### URL Routing
- `/` - Marketing landing page
- `/explore` - Protocol cards with filtering, sorting, search
- `/strategy` - Pre-built strategies (Native/Mixed/YieldMaxxer) and custom builder
- `/allocate` - Deployment review with yield calculations
- `/protocol/[slug]` - Individual protocol detail pages

### Key Components (in yieldsonbitcoin.jsx)
- `App({ initialPage, initialView, initialProtocolSlug, initialStrategy, initialCustom })` - Main component
- `MiniSparkline({ data, color, width, height })` - SVG sparkline for protocol cards
- `HistoryChart({ data, color, height, isPercentage, timeRange })` - Bar chart for APY/TVL history
- `ProtocolDetail({ protocol, ... })` - Full protocol detail view
- `RiskBadge({ risk })` - Color-coded risk indicator
- `RiskGrade({ risk })` - Letter grade risk display (AA-, BB+, B-)
- `Particles()` - Floating animated background
- `formatTVL(m)` - Formats millions/billions

### Data Flow
1. **Live Data**: useBtcPrice() and useProtocols() hooks fetch from /api routes
2. **Protocol Config**: PROTOCOL_CONFIG in lib/constants/protocols.js (28 protocols)
3. **Strategy State**: Passed via URL params (?strategy=Native) or sessionStorage (custom)
4. **TVL-Weighted Stats**: avgApy calculated weighted by TVL, not simple average

### Protocol Data Structure
```javascript
{
  id: 1,
  slug: "babylon-finance",     // DeFiLlama slug (null if not on DeFiLlama)
  urlSlug: "babylon",          // URL-friendly slug for routing
  name: "Babylon Labs",
  category: "Native Staking",
  apy: 0.5,
  apyRange: [0.29, 1.0],
  tvl: 5920,                   // In millions
  risk: "Low",                 // Low | Medium | High
  chain: "Bitcoin",
  lockup: "21 days",
  minDeposit: 0.01,
  description: "...",
  website: "https://...",
  token: "BABY",
  audits: 4,
  auditors: ["Halborn", "CertiK", ...],
  mechanics: ["Step 1...", "Step 2..."],
  logo: "₿",
  color: "#F7931A",
  trend: [0.3, 0.35, ...]      // Historical APY data points
}
```

### Strategies
- **Native**: Pure Bitcoin staking (Babylon, Stacks, Botanix, Mezo) - 5.5% APY
- **Mixed**: Diversified (Morpho, SolvBTC, Lombard, Babylon, Botanix) - 4.3% APY
- **YieldMaxxer**: Maximum yield (Pendle, BounceBit, SolvBTC, Ethena) - 10% APY

## Styling

- Inline CSS-in-JS throughout
- CSS animations: floatP, pulseG, pulse, slideU, slideD, ticker, borderP
- Google Fonts: JetBrains Mono, Sora, DM Sans, Space Grotesk
- Dark theme: background #06070B/#08090E, accent #F7931A (Bitcoin orange)
- Logo: "y₿" in orange gradient box

## Development

```bash
npm install     # Install dependencies
npm run dev     # Start dev server (default port 3000)
npm run build   # Production build
npm run start   # Run production server
```

## API Routes

### GET /api/btc-price
Returns: `{ price: number, source: "coingecko"|"binance"|"fallback", timestamp: string }`
Cache: 60 seconds

### GET /api/protocols
Returns: `{ protocols: Protocol[], timestamp: string }`
Cache: 5 minutes
Fetches live TVL from DeFiLlama for protocols with valid slugs.

## Deployment

Deploy on Vercel with the **Next.js** preset. No additional configuration needed.
