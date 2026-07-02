import { NextResponse } from "next/server";
import {
  CRYPTO_WALLETS,
  fetchCryptoRatesUsd,
  formatCryptoAmount,
  getCryptoWallet,
  isCryptoAutoActivateEnabled,
} from "@/lib/payments/crypto-config";

export async function GET() {
  try {
    const rates = await fetchCryptoRatesUsd();
    const wallets = CRYPTO_WALLETS.map((wallet) => ({
      coin: wallet.coin,
      symbol: wallet.symbol,
      address: wallet.address,
      network: wallet.network,
      rate: rates[wallet.symbol] ?? wallet.fallbackRateUsd,
    }));

    return NextResponse.json({ wallets, autoActivate: isCryptoAutoActivateEnabled() });
  } catch (error) {
    console.error("GET /api/payments/crypto failed:", error);
    return NextResponse.json({ error: "Failed to load crypto payment options" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { getSessionUserId, requireApiRole } = await import("@/lib/api/auth");
    const auth = await requireApiRole(["male", "female", "admin"]);
    if (auth.error) return auth.error;

    const userId = getSessionUserId(auth.session!);
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, billing, symbol, txHash } = body;

    if (!plan || !symbol) {
      return NextResponse.json({ error: "plan and symbol are required" }, { status: 400 });
    }

    const wallet = getCryptoWallet(symbol);
    if (!wallet) {
      return NextResponse.json({ error: "Unsupported cryptocurrency" }, { status: 400 });
    }

    const { parseBillingCycle, resolvePlanPricing } = await import("@/lib/payments/membership");
    const { createPayment, updatePaymentStatus } = await import("@/lib/db/payments");
    const { fulfillPayment } = await import("@/lib/payments/fulfill");

    const billingCycle = parseBillingCycle(billing ?? "monthly");
    const pricing = await resolvePlanPricing(plan, billingCycle);
    const rates = await fetchCryptoRatesUsd();
    const rateUsd = rates[wallet.symbol] ?? wallet.fallbackRateUsd;
    const usdAmount = pricing.amountCents / 100;
    const cryptoAmount = formatCryptoAmount(usdAmount / rateUsd, wallet.symbol);

    const payment = await createPayment({
      userId,
      plan: pricing.plan,
      billingCycle: pricing.billingCycle,
      amountCents: pricing.amountCents,
      method: "CRYPTO",
      cryptoSymbol: wallet.symbol,
      cryptoAmount,
      cryptoAddress: wallet.address,
      cryptoTxHash: txHash?.trim() || undefined,
    });

    if (isCryptoAutoActivateEnabled()) {
      const completed = await fulfillPayment(payment.id, {
        cryptoTxHash: txHash?.trim() || undefined,
      });

      return NextResponse.json({
        status: "completed",
        payment: completed,
        message: "Membership activated. Crypto payment recorded for verification.",
      });
    }

    await updatePaymentStatus(payment.id, "PROCESSING");

    return NextResponse.json({
      status: "processing",
      payment,
      message: "Payment submitted. Membership will activate within 30 minutes after verification.",
    });
  } catch (error) {
    console.error("POST /api/payments/crypto failed:", error);
    return NextResponse.json({ error: "Failed to submit crypto payment" }, { status: 500 });
  }
}
