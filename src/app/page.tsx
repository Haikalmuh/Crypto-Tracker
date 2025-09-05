"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import type { CryptoCoin, SortKey } from "@/types/crypto";
import CoinCard from "@/components/CoinCard";
import { CoinsGridSkeleton } from "@/components/LoadingSkeletons";
import Navbar from "@/components/Navbar";
import ControlsBar from "@/components/ControlsBar";
import { useCoins } from "@/context/CoinContext";
import Hero from "@/components/Hero";

export default function Home() {
  const { coins, loading, error, lastUpdated, refresh } = useCoins();

  // filter / sort state
  const [search, setSearch] = useState("");
  const [only, setOnly] = useState<"all" | "gainers" | "losers">("all");
  const [order, setOrder] = useState<SortKey>("market_cap_desc");

  // filter & sort logic
  const filteredCoins = useMemo(() => {
    let list = [...coins];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (coin) =>
          coin.name.toLowerCase().includes(q) ||
          coin.symbol.toLowerCase().includes(q)
      );
    }

    if (only === "gainers") {
      list = list.filter((coin) => (coin.price_change_percentage_24h ?? 0) > 0);
    } else if (only === "losers") {
      list = list.filter((coin) => (coin.price_change_percentage_24h ?? 0) < 0);
    }

    const comparators: Record<
      SortKey,
      (a: CryptoCoin, b: CryptoCoin) => number
    > = {
      market_cap_desc: (a, b) => b.market_cap - a.market_cap,
      market_cap_asc: (a, b) => a.market_cap - b.market_cap,
      price_desc: (a, b) => b.current_price - a.current_price,
      price_asc: (a, b) => a.current_price - b.current_price,
      price_change_percentage_24h_desc: (a, b) =>
        (b.price_change_percentage_24h ?? 0) -
        (a.price_change_percentage_24h ?? 0),
      price_change_percentage_24h_asc: (a, b) =>
        (a.price_change_percentage_24h ?? 0) -
        (b.price_change_percentage_24h ?? 0),
      volume_desc: (a, b) => b.total_volume - a.total_volume,
      volume_asc: (a, b) => a.total_volume - b.total_volume,
    };

    return list.sort(comparators[order]);
  }, [coins, search, only, order]);

  if (error && !loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <button
                onClick={refresh}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        
        {/* Hero */}
        <Hero lastUpdated={lastUpdated} loading={loading} onRefresh={refresh} />

        {/* Controls + Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Top 50 Cryptocurrencies
              </h2>
              <div className="text-sm text-muted-foreground">
                Showing {filteredCoins.length} coins
              </div>
            </div>

            <ControlsBar
              search={search}
              onSearchChange={setSearch}
              only={only}
              onOnlyChange={setOnly}
              order={order}
              onOrderChange={setOrder}
            />

            {loading ? (
              <CoinsGridSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {filteredCoins.map((coin, index) => (
                  <div
                    key={coin.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CoinCard coin={coin} />
                  </div>
                ))}
              </div>
            )}

            {/* Market Stats */}
            {!loading && coins.length > 0 && (
              <div className="mt-16 p-6 bg-card border border-border rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Market Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Gainers (24h)
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {
                        coins.filter(
                          (c) => (c.price_change_percentage_24h ?? 0) > 0
                        ).length
                      }
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Losers (24h)
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {
                        coins.filter(
                          (c) => (c.price_change_percentage_24h ?? 0) < 0
                        ).length
                      }
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Avg. Change
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {coins.length > 0
                        ? `${(
                            coins.reduce(
                              (sum, c) =>
                                sum + (c.price_change_percentage_24h ?? 0),
                              0
                            ) / coins.length
                          ).toFixed(2)}%`
                        : "0%"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Coins
                    </p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {coins.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <style jsx>{`
          .gradient-text {
            background: linear-gradient(
              135deg,
              hsl(var(--primary)),
              hsl(var(--primary) / 0.7)
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
      </main>
    </>
  );
}
