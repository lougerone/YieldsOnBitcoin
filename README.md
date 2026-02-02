# yields**on**bitcoin

> Every BTC yield protocol. One dashboard. One click to deploy.

A Bitcoin yield aggregation platform that lets users compare protocols, build strategies, and allocate BTC across the best yield opportunities in the ecosystem — from a single interface.

**Live at:** [yieldsonbitcoin.com](https://yieldsonbitcoin.com)

---

## What It Does

Bitcoin holders are leaving yield on the table. The BTCFi ecosystem is fragmented across dozens of protocols, each with different risk profiles, lockup periods, chains, and APYs. There's no single place to see them all, compare them side-by-side, and deploy capital.

**yieldsonbitcoin** solves this in three steps:

1. **Compare** — 12+ BTC yield protocols aggregated with real-time APY, TVL, risk ratings, trend charts, and lockup data. Filter by category, risk level, chain. Sort by any metric. Expand any card for full details. Select up to 5 for side-by-side comparison.

2. **Strategize** — Choose from 3 preset strategies (Conservative 5.8%, Balanced 8.4%, Aggressive 13.6%) or build a custom allocation with drag sliders. Blended APY calculates in real-time as you adjust weights.

3. **Allocate** — Review your full position breakdown with per-protocol BTC amounts, projected annual/monthly yields, and a risk assessment. Deploy across all selected protocols with a single atomic transaction.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Charts:** Inline SVG sparklines (no chart library)
- **Styling:** CSS-in-JS with inline styles (no external stylesheets)
- **Fonts:** Sora (headings), JetBrains Mono (data/mono), DM Sans (body) via Google Fonts
- **State:** React hooks (`useState`, `useMemo`, `useEffect`)
- **Architecture:** Two-page SPA — marketing homepage + full dashboard app

---

## Project Structure

```
app/
  layout.jsx            # Root layout with metadata
  page.jsx              # Imports main App component
yieldsonbitcoin.jsx     # Complete application (homepage + dashboard)
package.json            # Next.js 15 + React 19
next.config.js          # Next.js configuration
CLAUDE.md               # Claude Code guidance
README.md               # This file
```

### Single-File Architecture

The core app ships as one `.jsx` file (`yieldsonbitcoin.jsx`), wrapped in Next.js for deployment. This keeps the component portable while enabling Vercel deployment. It contains:

- Full marketing homepage with hero, ticker, how-it-works, protocol table, strategy preview, and CTA sections
- Complete three-view dashboard (Explore / Strategy / Allocate)
- 12-protocol dataset with mock metrics
- All animations, interactions, and responsive behavior

---

## Pages & Views

### Homepage (`page === "home"`)

| Section | Description |
|---------|-------------|
| **Hero** | "Best Yields on Bitcoin" headline with animated gradient, particle field, orbital rings, live badge, and dual CTA |
| **Protocol Ticker** | Infinite horizontal scroll showing all protocols with live APY |
| **How It Works** | Three-step cards (Compare → Strategize → Allocate) with hover animations |
| **Live Yields Table** | Top 8 protocols in sortable table with sparklines, risk badges, TVL |
| **Strategies Preview** | Three preset strategies with allocation bars and risk indicators |
| **CTA** | "Stop leaving yield on the table" with pulsing border animation |

### Dashboard (`page === "app"`)

| View | Features |
|------|----------|
| **Explore** | Search, filter (category, risk), sort (APY, TVL, risk, name). Expandable protocol cards. Side-by-side comparison table (up to 5). Click-to-allocate from any card. |
| **Strategy** | BTC input with USD conversion. 3 preset strategies with visual allocation bars. Custom strategy builder with per-protocol sliders. Real-time blended APY. |
| **Allocate** | Per-protocol breakdown (BTC amount, projected yield). Summary sidebar with blended APY, annual/monthly projections, risk assessment, allocation visualization. Confirmation modal with gas estimate. |

---

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#06070B` / `#08090E` | Homepage / Dashboard |
| Surface | `#111218` | Cards, inputs |
| Border | `#1E1F2A` | Default borders |
| Bitcoin Accent | `#F7931A` | Primary actions, brand |
| Green | `#4ADE80` | APY values, positive |
| Yellow | `#FBBF24` | Medium risk |
| Red | `#F87171` | High risk |
| Text Primary | `#F7F7F8` | Headings |
| Text Secondary | `#A1A1AA` | Body |
| Text Muted | `#71717A` / `#52525B` | Labels, hints |

### Typography

| Font | Weight | Usage |
|------|--------|-------|
| Sora | 600–800 | Headings, APY values, CTAs |
| JetBrains Mono | 400–600 | Data, monospace elements, base font |
| DM Sans | 400–600 | Body copy, descriptions, nav links |

### Components

- **MiniSparkline** — SVG sparkline with gradient fill, accepts `data`, `color`, `width`, `height`
- **RiskBadge** — Color-coded risk indicator (Low/Medium/High) with dot
- **Particles** — Floating ambient particle system with random positioning and animation
- **formatTVL** — Helper function to format millions/billions for display

---

## Animations

| Animation | Usage |
|-----------|-------|
| `floatP` | Ambient floating particles |
| `pulseG` | Glowing box-shadow on primary CTA |
| `slideU` | Hero elements sliding up on load |
| `slideD` | Badge sliding down on load |
| `ticker` | Infinite horizontal protocol scroll |
| `borderP` | Pulsing border on CTA section |

All animations use CSS keyframes injected via `<style>` tag. No external animation libraries.

---

## Data Model

Each protocol object:

```javascript
{
  id: Number,           // Unique identifier
  name: String,         // Display name
  category: String,     // Protocol type (Native Staking, Lending, etc.)
  apy: Number,          // Current APY percentage
  apyRange: [min, max], // 30-day APY range
  tvl: Number,          // Total Value Locked in millions USD
  risk: String,         // "Low" | "Medium" | "High"
  chain: String,        // Deployment chain
  lockup: String,       // Lock period ("None", "7 days", "21 days", etc.)
  minDeposit: Number,   // Minimum BTC deposit
  description: String,  // One-line protocol description
  audits: Number,       // Number of completed audits
  logo: String,         // Unicode symbol
  color: String,        // Hex color for charts and badges
  trend: Number[],      // 8-point historical APY for sparkline
}
```

Strategies reference protocols by `id` with percentage allocations that sum to 100.

---

## Running Locally

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Run production server
```

## Deployment

Deploy on Vercel with the **Next.js** preset — no additional configuration needed.

---

## Roadmap

- [ ] Real API integration (live APY feeds from protocol APIs)
- [ ] Wallet connection (WalletConnect / Bitcoin wallets)
- [ ] Portfolio tracker for existing positions
- [ ] Historical APY charts (30d, 90d, 1yr)
- [ ] Protocol detail pages with full audit history
- [ ] Multi-sig support for institutional allocators
- [ ] Yield notifications and alerts
- [ ] Mobile-responsive layout optimization
- [ ] Risk scoring methodology documentation
- [ ] API for third-party integrations

---

## Domain Candidates

| Domain | Rationale |
|--------|-----------|
| **yieldsonbitcoin.com** ✓ | Current pick. Category-defining, brandable, "on Bitcoin" is a positioning statement |
| btcyield.com | Shortest, most direct. SEO keyword match. |
| yieldstack.io | Crypto-native ("stack sats"), action-implied, brandable |
| orangeyield.com | Bitcoin culture shorthand, memorable |
| satsyield.com | Speaks the audience's language |

---

## License

MIT

---

Built by [jayismeta.com](https://jayismeta.com)
