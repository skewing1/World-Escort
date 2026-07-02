export interface CryptoWalletConfig {
  coin: string;
  symbol: string;
  address: string;
  network: string;
  coingeckoId: string;
  fallbackRateUsd: number;
}

export const CRYPTO_WALLETS: CryptoWalletConfig[] = [
  {
    coin: "Bitcoin",
    symbol: "BTC",
    address: process.env.CRYPTO_BTC_ADDRESS ?? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin Mainnet",
    coingeckoId: "bitcoin",
    fallbackRateUsd: 65_000,
  },
  {
    coin: "Ethereum",
    symbol: "ETH",
    address: process.env.CRYPTO_ETH_ADDRESS ?? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    network: "ERC-20",
    coingeckoId: "ethereum",
    fallbackRateUsd: 3_200,
  },
  {
    coin: "USDT",
    symbol: "USDT",
    address: process.env.CRYPTO_USDT_ADDRESS ?? "TGyzqeQFAMDTZhHdtYELAovk3Y5yzDvqZR",
    network: "TRC-20",
    coingeckoId: "tether",
    fallbackRateUsd: 1,
  },
  {
    coin: "USDC",
    symbol: "USDC",
    address: process.env.CRYPTO_USDC_ADDRESS ?? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    network: "ERC-20",
    coingeckoId: "usd-coin",
    fallbackRateUsd: 1,
  },
];

export function getCryptoWallet(symbol: string): CryptoWalletConfig | undefined {
  return CRYPTO_WALLETS.find((wallet) => wallet.symbol === symbol.toUpperCase());
}

export function formatCryptoAmount(amount: number, symbol: string): string {
  const decimals = symbol === "BTC" ? 6 : symbol === "ETH" ? 4 : 2;
  return amount.toFixed(decimals);
}

export async function fetchCryptoRatesUsd(): Promise<Record<string, number>> {
  const ids = CRYPTO_WALLETS.map((wallet) => wallet.coingeckoId).join(",");
  const fallback = Object.fromEntries(
    CRYPTO_WALLETS.map((wallet) => [wallet.symbol, wallet.fallbackRateUsd]),
  );

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) return fallback;

    const data = (await response.json()) as Record<string, { usd?: number }>;
    const rates: Record<string, number> = { ...fallback };

    for (const wallet of CRYPTO_WALLETS) {
      const usd = data[wallet.coingeckoId]?.usd;
      if (usd && usd > 0) {
        rates[wallet.symbol] = usd;
      }
    }

    return rates;
  } catch {
    return fallback;
  }
}

export function isCryptoAutoActivateEnabled(): boolean {
  return process.env.CRYPTO_AUTO_ACTIVATE !== "false";
}
