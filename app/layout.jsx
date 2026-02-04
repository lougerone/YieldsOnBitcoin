import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'YieldsOnBitcoin - Compare Bitcoin Yield Protocols | Best BTC Staking APY Rates',
  description: 'Find the best Bitcoin yield opportunities. Compare 20+ BTC staking protocols, real-time APY rates from 3-15%, TVL tracking, and risk ratings. Babylon, Lombard, Solv, Stacks & more.',
  keywords: 'Bitcoin yield, BTC staking, Bitcoin DeFi, crypto yield farming, Babylon staking, Bitcoin APY, BTC passive income, Bitcoin protocols, liquid staking Bitcoin, wrapped BTC yield',
  authors: [{ name: 'YieldsOnBitcoin' }],
  creator: 'YieldsOnBitcoin',
  publisher: 'YieldsOnBitcoin',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yieldsonbitcoin.com',
    siteName: 'YieldsOnBitcoin',
    title: 'YieldsOnBitcoin - Every BTC Yield. One Dashboard.',
    description: 'Compare 20+ Bitcoin yield protocols. Real-time APY rates, TVL tracking, risk ratings. Find the best returns for your BTC.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YieldsOnBitcoin - Bitcoin Yield Aggregator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YieldsOnBitcoin - Every BTC Yield. One Dashboard.',
    description: 'Compare 20+ Bitcoin yield protocols. Real-time APY rates, TVL tracking, risk ratings.',
    images: ['/og-image.png'],
    creator: '@jaybtc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
