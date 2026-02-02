import { Analytics } from '@vercel/analytics/next';
import { JetBrains_Mono, Sora, DM_Sans } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const sora = Sora({
  weight: ['300', '400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sora',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata = {
  title: 'Yields On Bitcoin',
  description: 'Explore Bitcoin yield protocols and build allocation strategies',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${sora.variable} ${dmSans.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
