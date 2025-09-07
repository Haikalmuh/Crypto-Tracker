import type { CryptoCoin, CoinDetail, ChartData, ProcessedChartData } from "@/types/crypto";

// 🔹 Format helper
export function formatCurrency(num: number, currency: string = "USD"): string {
  if (!num && num !== 0) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatNumber(num: number): string {
  if (!num && num !== 0) return "-";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
  return num.toString();
}

export function formatPercentage(num: number): string {
  if (!num && num !== 0) return "-";
  return `${num.toFixed(2)}%`;
}

// 🔹 Fetch Top Coins
export async function fetchTopCoins(
  page: number = 1,
  perPage: number = 50,
  currency: string = "usd"
): Promise<CryptoCoin[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch coins");
  }

  return res.json();
}

// 🔹 Search Coins
export async function searchCoins(query: string): Promise<any[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
  );

  if (!res.ok) {
    throw new Error("Failed to search coins");
  }

  const data = await res.json();
  return data.coins || [];
}

// 🔹 Fetch Coin Detail
export async function fetchCoinDetail(coinId: string): Promise<CoinDetail> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch coin detail");
  }

  return res.json();
}

// 🔹 Fetch Coin Chart
export async function fetchCoinChart(
  coinId: string,
  days: number = 7,
  currency: string = "usd"
): Promise<ProcessedChartData[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch coin chart");
  }

  const data: ChartData = await res.json();

  return data.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price,
    timestamp,
  }));
}
