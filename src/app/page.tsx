"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ControlsBar from "@/components/ControlsBar";
import CoinCard from "@/components/CoinCard";
import { CoinsGridSkeleton } from "@/components/LoadingSkeletons";
import { useCoins } from "@/context/CoinContext";
import type { CryptoCoin, SortKey } from "@/types/crypto";
import ErrorState from "@/components/ErrorState";
import Pagination from "@/components/Pagination";
import MarketStats from "@/components/MarketStats";

export default function Home() {
  const { coins, loading, error, lastUpdated, refresh } = useCoins();

  // filter / sort state
  const [search, setSearch] = useState("");
  const [only, setOnly] = useState<"all" | "gainers" | "losers">("all");
  const [order, setOrder] = useState<SortKey>("market_cap_desc");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

    const comparators: Record<SortKey, (a: CryptoCoin, b: CryptoCoin) => number> = {
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

  // pagination logic
  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);
  const paginatedCoins = filteredCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error && !loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ErrorState message={error} onRetry={refresh} />
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {paginatedCoins.map((coin, index) => (
                    <div
                      key={coin.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CoinCard coin={coin} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}

            {/* Market Stats */}
            {!loading && coins.length > 0 && <MarketStats coins={coins} />}
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
