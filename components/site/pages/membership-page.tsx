"use client";

import { useState } from "react";
import { Check, CreditCard, Wallet, Bitcoin } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PLANS_DATA } from "@/lib/mock-data";
import { PageHeader, planColor } from "@/lib/ui-styles";

export function MembershipPage() {
  const { goToPurchase } = useApp();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  return (
    <div className="pt-16 min-h-screen">
      <PageHeader eyebrow="Access Tiers" title="Choose Your Membership" sub="For gentleman members. Female profiles are free. Connection requests are included in each plan — no extra fees." />
      <div className="py-16 px-6 max-w-5xl mx-auto">
        <div className="flex justify-center mb-10"><div className="inline-flex items-center gap-4 bg-secondary border border-border px-4 py-2"><button onClick={() => setBilling("monthly")} className={`text-xs tracking-widests uppercase cursor-pointer ${billing === "monthly" ? "text-primary" : "text-muted-foreground"}`}>Monthly</button><div onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")} className={`relative w-10 h-5 cursor-pointer transition-colors ${billing === "annual" ? "bg-primary" : "bg-border"}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-foreground transition-transform ${billing === "annual" ? "translate-x-5" : ""}`} /></div><button onClick={() => setBilling("annual")} className={`text-xs tracking-widests uppercase cursor-pointer ${billing === "annual" ? "text-primary" : "text-muted-foreground"}`}>Annual <span className="text-emerald-400 ml-1">−20%</span></button></div></div>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {PLANS_DATA.map((plan) => (
            <div key={plan.name} className={`relative border p-8 ${plan.name === "Premium" ? "border-primary/60 bg-card" : "border-border bg-muted/30"}`}>
              {plan.name === "Premium" && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1"><span className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground font-semibold">Most Popular</span></div>}
              <div className={`text-[10px] tracking-[0.3em] uppercase font-semibold mb-4 ${planColor[plan.name]}`}>{plan.name}</div>
              <div className="mb-2"><span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-5xl font-medium text-foreground">${billing === "monthly" ? plan.monthly : plan.annual}</span><span className="text-muted-foreground text-sm ml-2">/month</span></div>
              <div className="mb-6 pb-6 border-b border-border"><div className="text-[10px] tracking-widests uppercase text-muted-foreground mb-1">Requests per month</div><div className={`text-2xl font-semibold ${planColor[plan.name]}`}>{String(plan.requests)}</div></div>
              <div className="space-y-2.5 mb-8">{["Browse all verified profiles", `${String(plan.requests)} connection requests/month`, ...(plan.name !== "Bronze" ? ["Priority support"] : []), ...(plan.name === "Elite" ? ["VIP-only profiles", "Dedicated account manager"] : [])].map((f) => <div key={f} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" /><span className="text-xs text-foreground">{f}</span></div>)}</div>
              <button onClick={() => goToPurchase(plan.name)} className={`w-full py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 cursor-pointer ${plan.name === "Premium" ? "bg-primary text-primary-foreground hover:brightness-110" : "border border-border text-foreground hover:border-primary hover:text-primary"}`}>Get Started</button>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 flex flex-wrap items-center justify-center gap-8">{[{ icon: CreditCard, l: "Visa / Mastercard / Amex" }, { icon: Wallet, l: "PayPal" }, { icon: Bitcoin, l: "BTC / ETH / USDT / USDC" }].map(({ icon: Icon, l }) => <div key={l} className="flex items-center gap-2 text-muted-foreground"><Icon className="w-4 h-4" /><span className="text-xs">{l}</span></div>)}</div>
        <p className="text-center text-xs text-muted-foreground mt-4">Female members create and manage profiles completely free of charge.</p>
      </div>
    </div>
  );
}

