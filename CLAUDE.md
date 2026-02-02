# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YieldsOnBitcoin is a single-file React application (~590 lines) for exploring Bitcoin yield protocols and building allocation strategies.

## Architecture

The entire app is in `yieldsonbitcoin.jsx`:

**Two Page Modes** (controlled by `page` state):
- `"home"` - Marketing landing page with hero, ticker, features, protocol table, strategy cards
- `"app"` - Dashboard with three views controlled by `view` state:
  - `explore` - Protocol cards with filtering, sorting, search, and side-by-side comparison
  - `strategy` - Pre-built strategies (Conservative/Balanced/Aggressive) and custom allocation builder
  - `allocate` - Deployment review with yield calculations and confirmation modal

**Components:**
- `App()` - Main component with dual-mode rendering (landing vs dashboard)
- `MiniSparkline({ data, color, width, height })` - SVG sparkline with gradient fill
- `RiskBadge({ risk })` - Color-coded risk indicator (Low=green, Medium=yellow, High=red)
- `Particles()` - Floating animated background particles
- `formatTVL(m)` - Formats millions/billions for display

**Data Constants:**
- `PROTOCOLS` - 12 protocols with: id, name, category, apy, apyRange, tvl, risk, chain, lockup, minDeposit, description, audits, logo, color, trend
- `CATEGORIES` - 11 category filter options
- `RISK_LEVELS` - All, Low, Medium, High
- `SORT_OPTIONS` - APY, TVL, Risk, Name sorting
- `STRATEGIES` - 3 preset strategies with allocations array referencing protocol IDs

**Key State:**
- `btcPrice = 97842` - Hardcoded BTC/USD price for conversions
- `selectedStrategy` / `customAllocations` - Tracks current allocation strategy
- `selectedProtocols` - Array of protocol IDs for comparison feature

## Styling

- Inline CSS-in-JS throughout
- CSS animations via `<style>` tag injection (floatP, pulseG, slideU, slideD, ticker, borderP)
- Google Fonts loaded via `<link>`: JetBrains Mono, Sora, DM Sans
- Dark theme: background #06070B/#08090E, accent #F7931A (Bitcoin orange)

## Development

```bash
npm install     # Install dependencies
npm run dev     # Start dev server at localhost:3000
npm run build   # Production build
npm run start   # Run production server
```

## Project Structure

```
app/
  layout.jsx    # Root layout with metadata
  page.jsx      # Imports and exports main App component
yieldsonbitcoin.jsx  # Main application component
```

## Deployment

Deploy on Vercel with the **Next.js** preset. No additional configuration needed.
