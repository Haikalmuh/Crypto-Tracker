import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CoinsProvider } from "@/context/CoinContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LumoCoin - Real-time Cryptocurrency Prices",
  description:
    "Track real-time cryptocurrency prices, market caps, and trends. Stay informed with the most accurate crypto market data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CoinsProvider>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </CoinsProvider>
      </body>
    </html>
  );
}
