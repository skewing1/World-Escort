"use client";

import { useState } from "react";
import { Check, CheckCircle2, Sliders } from "lucide-react";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import { PLANS_DATA } from "@/lib/mock-data";
import { goldBtn, inp, lbl, planColor } from "@/lib/ui-styles";

export function AdminPlansPage() {
  const [plansSaved, setPlansSaved] = useState(false);

  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Plans & Settings" />
      <div className="p-6 space-y-6">
        {plansSaved && (
          <div className="flex items-center gap-3 px-5 py-3 bg-emerald-950 border border-emerald-700/50 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />Settings saved.
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS_DATA.map((plan) => (
            <div key={plan.name} className="border border-border bg-card p-6">
              <div className={`text-xs font-bold tracking-widests uppercase mb-4 ${planColor[plan.name]}`}>{plan.name}</div>
              <div className="space-y-3">
                <div><label className={lbl}>Monthly Price ($)</label><input type="number" defaultValue={plan.monthly} className={`${inp} py-2`} /></div>
                <div><label className={lbl}>Annual Price ($/mo)</label><input type="number" defaultValue={plan.annual} className={`${inp} py-2`} /></div>
                <div><label className={lbl}>Requests/Month</label><input defaultValue={String(plan.requests)} className={`${inp} py-2`} /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="border border-border bg-card p-6">
          <h3 className="text-sm font-medium tracking-wide text-foreground mb-5 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />Platform Settings
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><label className={lbl}>Platform Commission (%)</label><input type="number" defaultValue={20} className={`${inp} py-2`} /></div>
              <div>
                <div className={lbl}>Accepted Crypto</div>
                {["Bitcoin (BTC)", "Ethereum (ETH)", "USDT", "USDC"].map((c) => (
                  <label key={c} className="flex items-center gap-2.5 cursor-pointer mb-2">
                    <div className="w-4 h-4 border border-primary bg-primary/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-primary" /></div>
                    <span className="text-xs text-foreground">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className={lbl}>Email Notifications</div>
              {["New registrations", "Profile approvals", "Connection requests", "Daily revenue"].map((n) => (
                <label key={n} className="flex items-center gap-2.5 cursor-pointer mb-2">
                  <div className="w-4 h-4 border border-primary bg-primary/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-primary" /></div>
                  <span className="text-xs text-foreground">{n}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={() => { setPlansSaved(true); setTimeout(() => setPlansSaved(false), 3000); }} className={goldBtn("md")}>
            Save Settings <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
