import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CoinsProvider } from "@/context/CoinContext";
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoTracker - Real-time Cryptocurrency Prices',
  description: 'Track real-time cryptocurrency prices, market caps, and trends. Stay informed with the most accurate crypto market data.',
  keywords: 'cryptocurrency, crypto, bitcoin, ethereum, prices, market cap, trading, blockchain',
  authors: [{ name: 'CryptoTracker' }],
  creator: 'CryptoTracker',
  publisher: 'CryptoTracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cryptotracker.example.com'),
  openGraph: {
    title: 'CryptoTracker - Real-time Cryptocurrency Prices',
    description: 'Track real-time cryptocurrency prices, market caps, and trends. Stay informed with the most accurate crypto market data.',
    url: 'https://cryptotracker.example.com',
    siteName: 'CryptoTracker',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CryptoTracker - Real-time Cryptocurrency Prices',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoTracker - Real-time Cryptocurrency Prices',
    description: 'Track real-time cryptocurrency prices, market caps, and trends. Stay informed with the most accurate crypto market data.',
    creator: '@cryptotracker',
    images: ['/og-image.jpg'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <div className="min-h-screen bg-background text-foreground">
          <CoinsProvider>{children}</CoinsProvider>
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}