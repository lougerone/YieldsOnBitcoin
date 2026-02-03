// Protocol configuration with DeFiLlama slugs for TVL fetching
// Data updated: February 3, 2026 - TVL verified via DeFiLlama API (live fetch)
// APY ranges only show CURRENT product tiers, not historical min/max
// Slugs verified: babylon-protocol (NOT babylon-finance), stacks-sbtc, mezo-bridge, etc.
export const PROTOCOL_CONFIG = [
  {
    id: 1,
    slug: "babylon-protocol",
    urlSlug: "babylon",
    name: "Babylon Labs",
    category: "Native Staking",
    apy: 13.5,
    apyRange: null, // Single rate, no tiers
    baseApy: 0.5,
    baseApyRange: [0.04, 1.05], // Valid range: varies by Finality Provider
    tokenRewards: { token: "BABY", apy: 13.0, note: "Paid in BABY tokens, subject to price volatility" },
    tvl: 4611, // DeFiLlama: $4.611B
    risk: "Low",
    chain: "Bitcoin",
    lockup: "21 days",
    minDeposit: 0.01,
    description: "Native BTC staking securing PoS chains. Base BTC APR: 0.04-1.05% + BABY token rewards ~13%. Total ~13.5% APY.",
    website: "https://babylonlabs.io",
    token: "BABY",
    audits: 4,
    auditors: ["Halborn", "CertiK", "Zellic", "Trail of Bits"],
    mechanics: [
      "Stake BTC directly on Bitcoin mainnet via time-lock scripts",
      "Secure proof-of-stake networks via 60 active Finality Providers",
      "No wrapping, bridging, or custody transfer required",
      "Earn BTC yield (0.04-1.05%) + BABY token rewards (~13%)"
    ],
    logo: "₿",
    color: "#F7931A",
    trend: [12.0, 12.5, 13.0, 12.8, 13.2, 13.5, 13.3, 13.5, 13.4, 13.5, 13.5, 13.5]
  },
  {
    id: 2,
    slug: "lombard",
    urlSlug: "lombard",
    name: "Lombard Finance",
    category: "Liquid Staking",
    apy: 0.4,
    apyRange: null, // Base rate only; DeFi strategies are separate products
    tvl: 907, // DeFiLlama: $907M
    risk: "Low",
    chain: "Ethereum",
    lockup: "None",
    minDeposit: 0.0002,
    description: "LBTC liquid staking token via Babylon. ~0.4% base APY from Babylon, up to 15% with DeFi strategies.",
    website: "https://lombard.finance",
    token: "LBTC",
    audits: 4,
    auditors: ["Halborn", "Zellic", "Spearbit", "Code4rena"],
    mechanics: [
      "Deposit BTC and receive LBTC liquid staking token 1:1",
      "LBTC earns Babylon staking rewards automatically",
      "Use LBTC across DeFi for additional yield opportunities",
      "Deploy on lending platforms for 5-15% additional APY"
    ],
    logo: "◆",
    color: "#6EE7B7",
    trend: [1.0, 0.8, 0.6, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
  },
  {
    id: 3,
    slug: "solv-protocol",
    urlSlug: "solvbtc",
    name: "SolvBTC",
    category: "Yield Vault",
    apy: 5.0,
    apyRange: [4.5, 6.6], // Valid: different vault products (BTC+, Aave integration)
    tvl: 74.28, // DeFiLlama Bitcoin chain: $74.28M
    risk: "Medium",
    chain: "Multi-chain",
    lockup: "7 days",
    minDeposit: 0.005,
    description: "Cross-chain yield optimization. BTC+ vault offers 4.5-5.5% APY. Up to 6.6% via Aave integration.",
    website: "https://solv.finance",
    token: "SolvBTC",
    audits: 3,
    auditors: ["Quantstamp", "SlowMist", "Secbit"],
    mechanics: [
      "Deposit BTC to mint SolvBTC universal reserve token",
      "Automated yield strategies across multiple chains",
      "Chainlink Proof of Reserve verifies 1:1 backing every 10 min",
      "xSolvBTC and SolvBTC.CORE for liquid staking rewards"
    ],
    logo: "◈",
    color: "#A78BFA",
    trend: [4.5, 5.0, 5.5, 5.2, 5.0, 4.8, 5.2, 5.0, 5.0, 5.0, 5.0, 5.0]
  },
  {
    id: 4,
    slug: "pendle",
    urlSlug: "pendle",
    name: "Pendle BTC",
    category: "Yield Trading",
    apy: 1.04,
    apyRange: null,
    tvl: 40, // BTC pools only: UNIBTC ~$27M + THBILL ~$14M
    risk: "Medium",
    chain: "Ethereum",
    lockup: "Variable",
    minDeposit: 0.01,
    description: "Tokenized yield trading via PT/YT tokens. BTC pools (UNIBTC) offer ~1% APY on principal tokens.",
    website: "https://pendle.finance",
    token: "PT/YT",
    audits: 5,
    auditors: ["Spearbit", "Ackee", "Dedaub", "Decurity", "ChainSecurity"],
    mechanics: [
      "Split yield-bearing assets into Principal (PT) and Yield (YT) tokens",
      "Trade fixed-rate yields by buying PT at discount",
      "Speculate on variable yields by buying YT tokens",
      "Boros platform enables BTC perpetual funding rate trading"
    ],
    logo: "◉",
    color: "#F472B6",
    trend: [1.2, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.04]
  },
  {
    id: 5,
    slug: "stacks-sbtc",
    urlSlug: "stacks",
    name: "Stacks Stacking",
    category: "L2 Stacking",
    apy: 8.9,
    apyRange: null, // Variable stacking rate, not product tiers
    baseApy: 5.0,
    baseApyRange: null, // Variable
    tokenRewards: { token: "STX", apy: 4.0, note: "BTC rewards from miners paid in STX value" },
    tvl: 355, // DeFiLlama verified: $355M (stacks-sbtc)
    risk: "Low",
    chain: "Stacks L2",
    lockup: "14 days",
    minDeposit: 0.001,
    description: "Earn ~8.9% APY via stacking. Base BTC yield ~5% + STX rewards ~4%. sBTC dual stacking available.",
    website: "https://stacks.co",
    token: "STX/sBTC",
    audits: 3,
    auditors: ["Least Authority", "NCC Group", "Coinspect"],
    mechanics: [
      "Lock STX tokens to support Stacks consensus mechanism",
      "Earn native BTC rewards from Bitcoin miners (~5%)",
      "Additional STX stacking rewards (~4%)",
      "Liquid stacking via StackingDAO for stSTX token"
    ],
    logo: "⬡",
    color: "#38BDF8",
    trend: [8.0, 8.5, 9.0, 9.0, 9.0, 8.9, 8.9, 8.9, 8.9, 8.9, 8.9, 8.9]
  },
  // AAVE removed - yield <0.01%, not useful
  // Morpho removed - general lending protocol, not Bitcoin-specific
  {
    id: 8,
    slug: null,
    urlSlug: "bouncebit",
    name: "BounceBit",
    category: "CeDeFi",
    apy: 13.3,
    apyRange: [10.0, 24.0],
    baseApy: 8.0,
    baseApyRange: [6.0, 12.0],
    tokenRewards: { token: "BB", apy: 5.0, note: "BB token staking rewards on top of basis trading" },
    tvl: 264.46, // DeFiLlama: $264M CeDeFi (basis trading)
    risk: "Medium",
    chain: "BounceBit",
    lockup: "30 days",
    minDeposit: 0.01,
    description: "CeDeFi restaking with institutional custody. Base ~8% from basis trading + BB token rewards ~5%. Prime up to 24%.",
    website: "https://bouncebit.io",
    token: "BBTC",
    audits: 2,
    auditors: ["BlockSec", "PeckShield"],
    mechanics: [
      "Deposit BTC with institutional-grade Mainnet Digital custody",
      "Base yield from delta-neutral basis trading (~8%)",
      "Additional BB token staking rewards (~5%)",
      "Prime product with BUIDL targets 10-24% annualized"
    ],
    logo: "◎",
    color: "#FBBF24",
    trend: [18.0, 16.0, 15.0, 14.5, 14.0, 13.5, 13.3, 13.3, 13.3, 13.3, 13.3, 13.3]
  },
  // Corn removed - TVL below $500K
  {
    id: 10,
    slug: "mezo-bridge",
    urlSlug: "mezo",
    name: "Mezo Network",
    category: "Economic Layer",
    apy: 4.0,
    apyRange: [4.0, 7.0],
    baseApy: 4.0,
    baseApyRange: [3.0, 4.5],
    tokenRewards: { token: "MEZO", apy: 3.0, note: "Early depositor boost via MEZO points" },
    tvl: 53, // DeFiLlama verified: $52.6M (mezo-bridge)
    risk: "Medium",
    chain: "Mezo",
    lockup: "Variable",
    minDeposit: 0.01,
    description: "Bitcoin L2 launched Jan 2026. Base BTC yield ~4% + MEZO rewards ~3%. Early depositors up to 7%.",
    website: "https://mezo.org",
    token: "MEZO",
    audits: 2,
    auditors: ["Trail of Bits", "Zellic"],
    mechanics: [
      "Proof of HODL mechanism rewards long-term BTC holders",
      "Base yield from protocol fees (~4%)",
      "MEZO token rewards for early depositors (~3%)",
      "tBTC powers gas fees and collateral natively"
    ],
    logo: "⬢",
    color: "#E879F9",
    trend: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0]
  },
  // Ethena removed - sUSDe staking is not Bitcoin yield
  // pSTAKE removed - essentially dead (TVL $0.47)
  {
    id: 13,
    slug: "botanix-stbtc",
    urlSlug: "botanix",
    name: "Botanix",
    category: "L2 Stacking",
    apy: 6.5,
    apyRange: null, // Variable staking rate
    tvl: 6.5, // DeFiLlama verified: $6.49M (botanix-stbtc)
    risk: "Medium",
    chain: "Botanix L2",
    lockup: "None",
    minDeposit: 0.001,
    description: "EVM Bitcoin L2 with stBTC. 50% gas fees to stakers. Stabilized at 6-7% APY, native BTC yield.",
    website: "https://botanixlabs.xyz",
    token: "stBTC",
    audits: 2,
    auditors: ["Spearbit", "Sigma Prime"],
    mechanics: [
      "EVM-equivalent Bitcoin L2 secured by Spiderchain validators",
      "Stake BTC via Rover to receive stBTC liquid token",
      "50% of all network gas fees redistributed to stBTC holders",
      "Instant unstaking with no waiting period"
    ],
    logo: "❋",
    color: "#22C55E",
    trend: [34.0, 20.0, 12.0, 8.0, 7.0, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5]
  },
  {
    id: 14,
    slug: "lorenzo-protocol",
    urlSlug: "lorenzo",
    name: "Lorenzo Protocol",
    category: "Liquid Staking",
    apy: 5.0,
    apyRange: [3.0, 8.0],
    tvl: 7.91, // DeFiLlama Bitcoin chain: $7.91M
    risk: "Medium",
    chain: "Multi-chain",
    lockup: "Variable",
    minDeposit: 0.001,
    description: "Bitcoin liquid staking via Babylon. stBTC + YAT tokens across 21+ chains. 3-8% APY typical.",
    website: "https://lorenzo-protocol.xyz",
    token: "stBTC/YAT",
    audits: 3,
    auditors: ["Zellic", "PeckShield", "BlockSec"],
    mechanics: [
      "Stake BTC via Babylon and receive stBTC liquid token",
      "YAT (Yield Accruing Token) captures staking rewards separately",
      "Cross-chain functionality on 21+ blockchain networks",
      "On-Chain Traded Funds (OTFs) for structured products"
    ],
    logo: "◈",
    color: "#8B5CF6",
    trend: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0]
  },
  {
    id: 15,
    slug: "bedrock-unibtc",
    urlSlug: "bedrock",
    name: "Bedrock uniBTC",
    category: "Restaking",
    apy: 8.0,
    apyRange: [5.0, 12.0],
    tvl: 149.84, // DeFiLlama Bitcoin chain: $149.84M
    risk: "Medium",
    chain: "Multi-chain",
    lockup: "None",
    minDeposit: 0.001,
    description: "Multi-asset liquid restaking. ~$700M TVL across 15+ chains. Dynamic APY via PoSL mechanism.",
    website: "https://www.bedrock.technology",
    token: "uniBTC",
    audits: 4,
    auditors: ["Zellic", "Secure3", "BlockSec", "Veridise"],
    mechanics: [
      "First multi-asset liquid restaking protocol",
      "Stake BTC and receive uniBTC yield-generating token",
      "Supported on 19+ chains including Ethereum, BNB, Arbitrum",
      "5,000+ BTC staked with 250K+ active users"
    ],
    logo: "◉",
    color: "#3B82F6",
    trend: [7.0, 7.5, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0]
  },
  // Pell removed - TVL below $500K ($489K)
  {
    id: 17,
    slug: "core",
    urlSlug: "core",
    name: "Core DAO",
    category: "L2 Stacking",
    apy: 5.0,
    apyRange: [4.0, 6.0],
    tvl: 28.81,
    risk: "Medium",
    chain: "Core",
    lockup: "Variable",
    minDeposit: 0.001,
    description: "Satoshi Plus consensus. lstBTC offers 4-6% BTC-denominated yield via Dual Staking mechanism.",
    website: "https://coredao.org",
    token: "lstBTC",
    audits: 4,
    auditors: ["Halborn", "PeckShield", "Zellic", "Secure3"],
    mechanics: [
      "Satoshi Plus consensus combining DPoW and DPoS",
      "Stake both CORE tokens and BTC for dual rewards",
      "lstBTC liquid staked Bitcoin for institutional yield",
      "Secured by Bitcoin miners and CORE stakers"
    ],
    logo: "◎",
    color: "#F59E0B",
    trend: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0]
  },
  {
    id: 18,
    slug: "bitlayer-ybtc-family",
    urlSlug: "bitlayer",
    name: "Bitlayer",
    category: "L2 Stacking",
    apy: 8.0,
    apyRange: [5.0, 20.0],
    tvl: 111, // DeFiLlama verified: $111M (bitlayer-ybtc-family)
    risk: "Medium",
    chain: "Bitlayer",
    lockup: "30 days",
    minDeposit: 0.01,
    description: "Bitcoin L2 using BitVM. BLBTC basis trading up to 20% APY. bfBTC flexible product 5-8% APY.",
    website: "https://bitlayer.org",
    token: "BLBTC",
    audits: 3,
    auditors: ["Trail of Bits", "Zellic", "BlockSec"],
    mechanics: [
      "First Bitcoin L2 using BitVM for trust-minimized bridging",
      "BLBTC yield-bearing BTC with basis trading strategies",
      "bfBTC flexible product with 5-8% APY",
      "200+ dApps with $30M institutional backing"
    ],
    logo: "◆",
    color: "#EC4899",
    trend: [14.0, 12.0, 10.0, 9.0, 8.5, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0]
  },
  {
    id: 19,
    slug: null,
    urlSlug: "bob",
    name: "BOB",
    category: "L2 Stacking",
    apy: 5.0,
    apyRange: [2.0, 6.6],
    tvl: 100, // Verified: $100M+ on-chain assets (gobob.xyz)
    risk: "Medium",
    chain: "BOB L2",
    lockup: "Variable",
    minDeposit: 0.001,
    description: "Hybrid L2 combining Bitcoin + Ethereum. Native Bitcoin Vaults with up to 6.6% APY via Aave integration.",
    website: "https://gobob.xyz",
    token: "BOB",
    audits: 3,
    auditors: ["OpenZeppelin", "Zellic", "Spearbit"],
    mechanics: [
      "Hybrid L2 with Bitcoin security and EVM compatibility",
      "Native Bitcoin Vaults with managed yield strategies",
      "Partners include Veda, Euler, Lombard, Gamma",
      "BitVM-based trust-minimized bridging in 2026"
    ],
    logo: "◇",
    color: "#F97316",
    trend: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0]
  },
  {
    id: 20,
    slug: null,
    urlSlug: "rootstock",
    name: "Rootstock (RSK)",
    category: "L2 Stacking",
    apy: 6.0,
    apyRange: [5.0, 25.0],
    tvl: 160, // Verified: ~$160M total (DeFiLlama rootstock chain)
    risk: "Low",
    chain: "Rootstock",
    lockup: "None",
    minDeposit: 0.001,
    description: "Oldest Bitcoin sidechain (since 2018). 80%+ hashpower security. RIF staking offers up to 30% ABI.",
    website: "https://rootstock.io",
    token: "rBTC",
    audits: 8,
    auditors: ["Trail of Bits", "OpenZeppelin", "Coinspect", "Bramah Systems", "Immunefi"],
    mechanics: [
      "Bitcoin sidechain secured by merge-mining with BTC miners",
      "Bridge BTC via Powpeg to receive rBTC 1:1",
      "Full EVM compatibility with 150+ dApps",
      "100% uptime since 2018, most battle-tested Bitcoin L2"
    ],
    logo: "◐",
    color: "#00B45A",
    trend: [6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0]
  },
  {
    id: 21,
    slug: "swell-btc-lrt",
    urlSlug: "swell",
    name: "Swell swBTC",
    category: "Restaking",
    apy: 2.75,
    apyRange: [2.0, 5.0],
    tvl: 0.5, // DeFiLlama verified: $537K (swell-btc-lrt)
    risk: "Medium",
    chain: "Ethereum",
    lockup: "10 days",
    minDeposit: 0.01,
    description: "First Bitcoin LRT. Earn restaking rewards from Symbiotic, EigenLayer, and Karak. ~2.75% avg APY.",
    website: "https://swellnetwork.io",
    token: "swBTC",
    audits: 4,
    auditors: ["Sigma Prime", "Mixbytes", "Pashov", "Cyfrin"],
    mechanics: [
      "Deposit WBTC and receive swBTC liquid restaking token",
      "Earn rewards from multiple restaking protocols simultaneously",
      "Aera-powered vault strategy with Gauntlet risk management",
      "10-day unstaking period for security"
    ],
    logo: "◑",
    color: "#38BDF8",
    trend: [2.5, 2.6, 2.7, 2.75, 2.75, 2.75, 2.75, 2.75, 2.75, 2.75, 2.75, 2.75]
  },
  {
    id: 22,
    slug: "merlins-seal",
    urlSlug: "merlin",
    name: "Merlin Chain",
    category: "L2 Stacking",
    apy: 8.0,
    apyRange: [8.0, 18.0],
    baseApy: 8.0,
    baseApyRange: [6.0, 10.0],
    tokenRewards: { token: "MERL", apy: 10.0, note: "MERL staking offers additional 10-18% APY" },
    tvl: 497.35, // DeFiLlama: $497.35M
    risk: "Medium",
    chain: "Merlin",
    lockup: "Variable",
    minDeposit: 0.001,
    description: "ZK-rollup for Bitcoin. Base BTC staking 8% + MERL rewards up to 10%. Combined up to 18%.",
    website: "https://merlinchain.io",
    token: "MERL",
    audits: 3,
    auditors: ["Zellic", "Secure3", "SlowMist"],
    mechanics: [
      "ZK-rollup architecture for Bitcoin scalability",
      "Base BTC staking yield ~8% (stMBTC 1:1)",
      "MERL token staking for additional 10-18% APY",
      "AI-driven chain abstraction in Merlin 2.0"
    ],
    logo: "⬡",
    color: "#7C3AED",
    trend: [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0]
  },
  {
    id: 23,
    slug: "chakra",
    urlSlug: "chakra",
    name: "Chakra",
    category: "Restaking",
    apy: 6.0,
    apyRange: [4.0, 10.0],
    tvl: 4, // DeFiLlama verified: $4.03M (chakra)
    risk: "Medium",
    chain: "Multi-chain",
    lockup: "Variable",
    minDeposit: 0.01,
    description: "ZK-based Bitcoin restaking. Modular settlement across 20+ chains. Self-custody staking via time-locks.",
    website: "https://chakrachain.io",
    token: "CHAKRA",
    audits: 2,
    auditors: ["Zellic", "BlockSec"],
    mechanics: [
      "Universal BTC settlement layer for cross-chain liquidity",
      "Route BTC and BTC-derived assets across 20+ chains",
      "ZK proofs for trustless staking verification",
      "50K+ users with modular settlement design"
    ],
    logo: "◈",
    color: "#E11D48",
    trend: [6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0]
  },
  // ALEX Lab removed - TVL only $1.5M, tier 3/4 protocol
  {
    id: 25,
    slug: "citrea-bridge",
    urlSlug: "citrea",
    name: "Citrea",
    category: "L2 Stacking",
    apy: 5.0,
    apyRange: [3.0, 8.0],
    tvl: 2, // DeFiLlama verified: $2.0M (citrea-bridge)
    risk: "High",
    chain: "Citrea",
    lockup: "Variable",
    minDeposit: 0.01,
    description: "First production ZK-rollup on Bitcoin (Jan 2026). cBTC 1:1 peg. Native lending via Morpho integration.",
    website: "https://citrea.xyz",
    token: "cBTC",
    audits: 2,
    auditors: ["Zellic", "Trail of Bits"],
    mechanics: [
      "zkEVM rollup with Bitcoin L1 settlement",
      "Clementine bridge for trust-minimized BTC transfers",
      "Native lending markets via Morpho integration",
      "ctUSD stablecoin backed by cBTC collateral"
    ],
    logo: "◇",
    color: "#06B6D4",
    trend: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0]
  },
  {
    id: 26,
    slug: null,
    urlSlug: "ledn",
    name: "Ledn",
    category: "CeFi Lending",
    apy: 2.0, // Tiered: 1% (0-2 BTC), 3% (2+ BTC)
    apyRange: [1.0, 3.0],
    tvl: 400, // $2.8B originated loans; ~$400M active loan book
    risk: "Low",
    chain: "Centralized",
    lockup: "None",
    minDeposit: 0.0001,
    description: "Bitcoin-focused CeFi. 1% APY (0-2 BTC), 3% APY (2+ BTC). $2.8B+ loans originated.",
    website: "https://ledn.io",
    token: "BTC",
    audits: 2,
    auditors: ["Armanino", "SOC 2 Type 2"],
    mechanics: [
      "CeFi lending with BitGo custody ($100M insurance)",
      "Growth Accounts earn yield on deposited BTC",
      "Bitcoin-backed loans at 50% LTV",
      "SOC 2 Type 2 compliance, daily compounding"
    ],
    logo: "◐",
    color: "#14B8A6",
    trend: [2.5, 2.3, 2.2, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0]
  },
  {
    id: 27,
    slug: "nexo",
    urlSlug: "nexo",
    name: "Nexo",
    category: "CeFi Lending",
    apy: 4.0,
    apyRange: [3.5, 7.0],
    tvl: 307, // DeFiLlama verified: $307M (nexo)
    risk: "Low",
    chain: "Centralized",
    lockup: "Flexible",
    minDeposit: 0.0001,
    description: "Crypto lending with tiered yields. Base 4% APY on BTC, up to 7% for Platinum tier + NEXO holdings.",
    website: "https://nexo.com",
    token: "NEXO",
    audits: 3,
    auditors: ["Armanino", "BitGo", "Ledger"],
    mechanics: [
      "Tiered yield system based on NEXO token holdings",
      "Flexible savings with instant withdrawals",
      "Fixed-term options for higher rates (up to 6.5%)",
      "Interest-free loans for BTC/ETH holders"
    ],
    logo: "◑",
    color: "#0052FF",
    trend: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0]
  },
  {
    id: 28,
    slug: "compound-finance",
    urlSlug: "compound",
    name: "Compound",
    category: "Lending",
    apy: 1.0,
    apyRange: null, // Variable lending rate
    tvl: 1550, // DeFiLlama verified: $1.55B (compound-finance)
    risk: "Low",
    chain: "Ethereum",
    lockup: "None",
    minDeposit: 0.001,
    description: "Pioneer DeFi lending. wBTC supply ~1% APR base + COMP rewards. Algorithmic rates.",
    website: "https://compound.finance",
    token: "cWBTC",
    audits: 10,
    auditors: ["OpenZeppelin", "Trail of Bits", "Gauntlet", "ChainSecurity", "ABDK"],
    mechanics: [
      "Algorithmic interest rates based on supply/demand",
      "Supply wBTC to earn variable interest + COMP rewards",
      "Use wBTC as collateral to borrow stablecoins",
      "Battle-tested since 2018 with billions in TVL"
    ],
    logo: "◎",
    color: "#00D395",
    trend: [2.0, 1.5, 1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
  },
];

export const CATEGORIES = ["All", "Native Staking", "Liquid Staking", "Restaking", "Lending", "CeFi Lending", "Yield Vault", "Yield Trading", "Yield Farming", "CeDeFi", "L2 Stacking", "Economic Layer"];
export const RISK_LEVELS = ["All", "Low", "Medium", "High"];
export const SORT_OPTIONS = [
  { label: "Highest APY", value: "apy-desc" },
  { label: "Lowest APY", value: "apy-asc" },
  { label: "Highest TVL", value: "tvl-desc" },
  { label: "Lowest Risk", value: "risk-asc" },
  { label: "Name A-Z", value: "name-asc" },
];

// Strategies updated Feb 2026 - uses upper APY ranges
// Native: Babylon 13.5% * 35% + Stacks 8.9% * 30% + Botanix 6.5% * 25% + Mezo 7% * 10% = 9.9%
// Mixed: Bedrock 12% * 25% + Solv 6.6% * 25% + Lombard 0.4% * 20% + Babylon 13.5% * 15% + Botanix 6.5% * 15% = 7.7%
// YieldMaxxer: Bitlayer 20% * 30% + BounceBit 24% * 25% + Solv 6.6% * 25% + Merlin 18% * 20% = 17.3%
export const STRATEGIES = [
  { name: "Native", description: "Pure Bitcoin staking. No wrapping, no bridges. Native BTC yields from L2s.", icon: "₿", allocations: [{ id: 1, pct: 35 }, { id: 5, pct: 30 }, { id: 13, pct: 25 }, { id: 10, pct: 10 }], expectedApy: 9.9, riskLevel: "Low" },
  { name: "Mixed", description: "Diversified exposure across restaking, staking, and yield vaults.", icon: "⚖️", allocations: [{ id: 15, pct: 25 }, { id: 3, pct: 25 }, { id: 2, pct: 20 }, { id: 1, pct: 15 }, { id: 13, pct: 15 }], expectedApy: 7.7, riskLevel: "Medium" },
  { name: "YieldMaxxer", description: "Maximum APY. CeDeFi and L2 strategies on Bitcoin.", icon: "🚀", allocations: [{ id: 18, pct: 30 }, { id: 8, pct: 25 }, { id: 3, pct: 25 }, { id: 22, pct: 20 }], expectedApy: 17.3, riskLevel: "High" },
];

// Fallback BTC price if APIs fail
export const FALLBACK_BTC_PRICE = 97842;
