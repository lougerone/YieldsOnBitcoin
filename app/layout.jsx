import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'YieldsOnBitcoin',
  description: 'Best yields on Bitcoin. Compare protocols, build strategies, deploy with one click.',
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
