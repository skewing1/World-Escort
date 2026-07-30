"use client";

import { AdminPageHeader } from "@/components/site/admin/admin-page-header";

export function AdminAnalyticsPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Analytics" />
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border bg-card p-6">
            <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Monthly Revenue</h3>
            <div className="flex items-end gap-2 h-40">
              {[{ m: "Jan", v: 180 }, { m: "Feb", v: 210 }, { m: "Mar", v: 195 }, { m: "Apr", v: 230 }, { m: "May", v: 248 }, { m: "Jun", v: 284 }].map(({ m, v }) => (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[9px] text-muted-foreground">${v}k</div>
                  <div className="w-full relative" style={{ height: `${(v / 300) * 128}px`, background: "rgba(196,146,42,0.15)" }}>
                    <div className="absolute inset-0 bg-primary/80 hover:bg-primary transition-colors" />
                  </div>
                  <div className="text-[9px] text-muted-foreground">{m}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border bg-card p-6">
            <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Members by Plan</h3>
            <div className="space-y-4">
              {[{ label: "Elite", value: 3241, total: 12847, color: "bg-purple-500" }, { label: "Premium", value: 5102, total: 12847, color: "bg-primary" }, { label: "Bronze", value: 4504, total: 12847, color: "bg-amber-600" }].map(({ label, value, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-medium">{value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted">
                    <div className={`h-full ${color}`} style={{ width: `${(value / total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
              <div>
                <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-foreground">+847</div>
                <div className="text-[10px] tracking-wide text-muted-foreground">New this month</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-foreground">91%</div>
                <div className="text-[10px] tracking-wide text-muted-foreground">Retention rate</div>
              </div>
            </div>
          </div>
          <div className="border border-border bg-card p-6">
            <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Top Member Countries</h3>
            <div className="space-y-3">
              {[{ country: "United States", count: 3241, pct: 25 }, { country: "United Kingdom", count: 1876, pct: 15 }, { country: "Germany", count: 1543, pct: 12 }, { country: "Australia", count: 1102, pct: 9 }, { country: "Switzerland", count: 987, pct: 8 }].map(({ country, count, pct }) => (
                <div key={country} className="flex items-center gap-4">
                  <div className="w-28 shrink-0 text-xs text-muted-foreground truncate">{country}</div>
                  <div className="flex-1 h-1.5 bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${pct * 4}%` }} />
                  </div>
                  <div className="w-12 text-right text-xs text-foreground">{count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border bg-card p-6">
            <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Conversion Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: "Browse → Request", value: "12.4%", trend: "↑ 2.1%" }, { label: "Request → Approval", value: "68.7%", trend: "↑ 5.3%" }, { label: "Visit → Register", value: "8.2%", trend: "↓ 0.4%" }, { label: "Free → Paid", value: "34.5%", trend: "↑ 1.8%" }].map(({ label, value, trend }) => (
                <div key={label} className="border border-border p-4">
                  <div className="text-[10px] tracking-widests uppercase text-muted-foreground mb-1">{label}</div>
                  <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-foreground">{value}</div>
                  <div className={`text-[10px] mt-0.5 ${trend.startsWith("↑") ? "text-emerald-400" : "text-rose-400"}`}>{trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
