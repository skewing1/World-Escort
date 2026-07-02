"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Crown, ArrowRight, ChevronLeft, ChevronRight, Check, Lock,
  Copy, Bitcoin, CreditCard, CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import type { PlanDto } from "@/lib/db/mappers";
import { goldBtn, inp, lbl, planBorder, planColor, SLabel } from "@/lib/ui-styles";
import { routes } from "@/lib/routes";

interface CryptoWallet {
  coin: string;
  symbol: string;
  address: string;
  network: string;
  rate: number;
}

export function PurchasePage({ selectedPlan }: { selectedPlan: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, openModal } = useApp();

  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plan, setPlan] = useState(selectedPlan);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [payMethod, setPayMethod] = useState<"card" | "crypto">("card");
  const [cryptoCoin, setCryptoCoin] = useState(0);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const [donePlan, setDonePlan] = useState(selectedPlan);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cryptoTxHash, setCryptoTxHash] = useState("");
  const [cancelled, setCancelled] = useState(false);

  const planData = plans.find((p) => p.name === plan) ?? plans[1];
  const price = planData
    ? billing === "monthly"
      ? planData.monthly
      : planData.annual
    : 0;
  const wallet = cryptoWallets[cryptoCoin];
  const cryptoAmt = wallet
    ? (price / wallet.rate).toFixed(wallet.symbol === "BTC" ? 6 : wallet.symbol === "ETH" ? 4 : 2)
    : "0";

  const verifyStripeSession = useCallback(async (sessionId: string) => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/stripe/session?session_id=${encodeURIComponent(sessionId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment verification failed");
      if (data.status === "completed") {
        setDonePlan(planData?.name ?? selectedPlan);
        setDone(true);
      } else {
        setError("Payment is still processing. Please refresh in a moment.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment verification failed");
    } finally {
      setProcessing(false);
    }
  }, [planData?.name, selectedPlan]);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, cryptoRes] = await Promise.all([
          fetch("/api/plans"),
          fetch("/api/payments/crypto"),
        ]);
        const plansData = await plansRes.json();
        const cryptoData = await cryptoRes.json();
        if (plansRes.ok) setPlans(plansData.plans ?? []);
        if (cryptoRes.ok) setCryptoWallets(cryptoData.wallets ?? []);
      } catch {
        setError("Failed to load checkout data");
      } finally {
        setLoadingPlans(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (searchParams.get("cancelled") === "1") {
      setCancelled(true);
    }
    const sessionId = searchParams.get("session_id");
    if (searchParams.get("success") === "1" && sessionId) {
      verifyStripeSession(sessionId);
    }
  }, [searchParams, verifyStripeSession]);

  function handleCopy() {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleStripeCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    if (!planData) return;

    setProcessing(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planData.name, billing }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setProcessing(false);
    }
  }

  async function handleCryptoSubmit() {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    if (!planData || !wallet) return;

    setProcessing(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planData.name,
          billing,
          symbol: wallet.symbol,
          txHash: cryptoTxHash.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Crypto payment failed");
      setDonePlan(planData.name);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crypto payment failed");
    } finally {
      setProcessing(false);
    }
  }

  if (loadingPlans || authLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 border border-primary/40 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground mb-3">
            Welcome to Aurum
          </h2>
          <p className="text-muted-foreground font-light mb-2">
            Your <span className="text-primary font-medium">{donePlan}</span> membership is now active.
          </p>
          <p className="text-xs text-muted-foreground mb-8">A confirmation has been sent to your email address.</p>
          <button onClick={() => router.push(routes.browse)} className={`${goldBtn("md")} justify-center`}>
            Browse Profiles <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (processing && searchParams.get("success") === "1") {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  if (!planData || plans.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <p className="text-muted-foreground">Unable to load membership plans.</p>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-border px-6 py-3" style={{ background: "#0A0813" }}>
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Link href={routes.membership} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />Membership
          </Link>
          <ChevronRight className="w-3 h-3" /><span className="text-foreground">Purchase</span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <SLabel text="Secure Checkout" />
          <h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground">
            Complete Your Membership
          </h1>
        </div>

        {!isAuthenticated && (
          <div className="mb-6 p-4 border border-primary/30 bg-primary/5 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground">Sign in required.</span>{" "}
              <button type="button" onClick={() => openModal("login")} className="text-primary hover:underline cursor-pointer">
                Log in
              </button>
              {" or "}
              <button type="button" onClick={() => openModal("register")} className="text-primary hover:underline cursor-pointer">
                create an account
              </button>
              {" "}to complete checkout.
            </div>
          </div>
        )}

        {cancelled && (
          <div className="mb-6 p-4 border border-amber-800/30 bg-amber-950/20 text-sm text-amber-300">
            Checkout was cancelled. You can try again below.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 border border-rose-800/30 bg-rose-950/20 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-5">
            <div className="border border-border bg-card p-5">
              <div className={lbl}>Select Plan</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {plans.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPlan(p.name)}
                    className={`py-3 px-2 border text-center transition-all cursor-pointer ${plan === p.name ? `${planBorder[p.name]} bg-primary/5` : "border-border hover:border-primary/30"}`}
                  >
                    <div className={`text-xs font-bold tracking-widest uppercase ${planColor[p.name]} mb-1`}>{p.name}</div>
                    <div className="text-lg font-semibold text-foreground">
                      ${billing === "monthly" ? p.monthly : p.annual}
                      <span className="text-[10px] text-muted-foreground">/mo</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setBilling("monthly")} className={`text-xs tracking-widest uppercase cursor-pointer ${billing === "monthly" ? "text-primary" : "text-muted-foreground"}`}>Monthly</button>
                <div onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")} className={`relative w-8 h-4 cursor-pointer transition-colors ${billing === "annual" ? "bg-primary" : "bg-border"}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-foreground transition-transform ${billing === "annual" ? "translate-x-4" : ""}`} />
                </div>
                <button onClick={() => setBilling("annual")} className={`text-xs tracking-widest uppercase cursor-pointer ${billing === "annual" ? "text-primary" : "text-muted-foreground"}`}>
                  Annual <span className="text-emerald-400">−20%</span>
                </button>
              </div>
            </div>

            <div className="border border-border bg-card">
              <div className="flex border-b border-border">
                {[
                  { k: "card" as const, icon: CreditCard, label: "Credit / Debit Card" },
                  { k: "crypto" as const, icon: Bitcoin, label: "Cryptocurrency" },
                ].map(({ k, icon: Icon, label }) => (
                  <button
                    key={k}
                    onClick={() => setPayMethod(k)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-wide uppercase transition-colors cursor-pointer border-b-2 ${payMethod === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {payMethod === "card" && (
                  <form onSubmit={handleStripeCheckout} className="space-y-4">
                    <p className="text-sm text-muted-foreground font-light">
                      Pay securely with Stripe. You&apos;ll be redirected to complete payment — card details are never stored on our servers.
                    </p>
                    <button
                      type="submit"
                      disabled={processing}
                      className={`${goldBtn("lg")} w-full justify-center disabled:opacity-60`}
                    >
                      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      Pay ${billing === "monthly" ? planData.monthly : planData.annual * 12} {billing === "monthly" ? "/ month" : "/ year"}
                    </button>
                    <p className="text-[10px] text-muted-foreground text-center">256-bit SSL encrypted via Stripe Checkout.</p>
                  </form>
                )}
                {payMethod === "crypto" && wallet && (
                  <div className="space-y-4">
                    <div className={lbl}>Select Cryptocurrency</div>
                    <div className="grid grid-cols-4 gap-2">
                      {cryptoWallets.map((c, i) => (
                        <button
                          key={c.symbol}
                          onClick={() => setCryptoCoin(i)}
                          className={`py-2 px-1 border text-center transition-all cursor-pointer ${cryptoCoin === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"}`}
                        >
                          <div className="text-xs font-bold text-foreground">{c.symbol}</div>
                          <div className="text-[9px] text-muted-foreground">{c.coin}</div>
                        </button>
                      ))}
                    </div>
                    <div className="border border-border bg-muted/30 p-5 space-y-4">
                      <div className="text-center">
                        <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">Send exactly</div>
                        <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-primary">{cryptoAmt} {wallet.symbol}</div>
                        <div className="text-xs text-muted-foreground mt-1">(≈ ${price} USD) · {wallet.network}</div>
                      </div>
                      <div className="flex justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(wallet.address)}`}
                          alt={`${wallet.symbol} payment QR code`}
                          className="w-32 h-32 border border-border"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Wallet Address</div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-[11px] text-foreground bg-background border border-border px-3 py-2 break-all font-mono">{wallet.address}</code>
                          <button type="button" onClick={handleCopy} className="shrink-0 w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Transaction Hash (optional)</label>
                      <input
                        value={cryptoTxHash}
                        onChange={(e) => setCryptoTxHash(e.target.value)}
                        placeholder="Paste your on-chain transaction ID"
                        className={inp}
                      />
                    </div>
                    <div className="p-4 border border-amber-800/30 bg-amber-950/20">
                      <p className="text-xs text-amber-300 leading-relaxed">
                        Send only {wallet.symbol} to this address on {wallet.network}. After payment, your membership will be activated once verified.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCryptoSubmit}
                      disabled={processing}
                      className={`${goldBtn("md")} w-full justify-center disabled:opacity-60`}
                    >
                      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      I Have Sent the Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="sticky top-24 border border-border bg-card p-6 space-y-5">
              <h3 className="text-sm font-medium tracking-wide text-foreground">Order Summary</h3>
              <div className="border-b border-border pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-bold tracking-widest uppercase ${planColor[plan]}`}>{plan} Membership</div>
                    <div className="text-xs text-muted-foreground capitalize">{billing} billing</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">${price}<span className="text-muted-foreground text-xs">/mo</span></div>
                    {billing === "annual" && (
                      <div className="text-[10px] text-emerald-400">Save ${(planData.monthly - planData.annual) * 12}/yr</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Total due today</span>
                  <span className="text-primary font-semibold">${billing === "monthly" ? price : price * 12}</span>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Included</div>
                {[
                  `${planData.requests === "Unlimited" ? "Unlimited" : planData.requests} requests/month`,
                  "Browse all verified profiles",
                  ...(plan !== "Bronze" ? ["Priority support"] : []),
                  ...(plan === "Elite" ? ["VIP-only profiles", "Dedicated account manager"] : []),
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />{f}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Secure checkout. Cancel anytime.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

