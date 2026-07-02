"use client";

import { useState } from "react";
import {
  Crown, Heart, Check, MessageCircle, UserCheck, Users, Upload, Download,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import type { MaleTab } from "@/lib/types";
import { PLANS_DATA } from "@/lib/mock-data";
import {
  ghostBtn, goldBtn, inp, lbl, planBorder, planColor, statusBadge,
} from "@/lib/ui-styles";

export function MaleDashboard() {
  const { goToPurchase } = useApp();
  const [tab, setTab] = useState<MaleTab>("overview");
  const currentPlan = "Premium";
  const requestsUsed = 12;
  const requestLimit = 20;
  const [profileForm, setProfileForm] = useState({ firstName: "James", lastName: "Keller", email: "j.keller@email.com", location: "London, United Kingdom", bio: "Finance professional with a passion for travel, contemporary art, and fine dining. Frequently based between London and Paris.", phone: "+44 7700 900000" });
  const [saved, setSaved] = useState(false);

  const myRequests = [
    { profile: "Amélie Fontaine", date: "Jun 18, 2025", status: "approved" },
    { profile: "Natasha Volkov", date: "Jun 10, 2025", status: "pending" },
    { profile: "Camille Dubois", date: "May 28, 2025", status: "rejected" },
    { profile: "Sofia Marchetti", date: "May 15, 2025", status: "approved" },
  ];
  const billing = [
    { desc: "Premium Membership", amount: "$149", date: "Jun 1, 2025", status: "Paid" },
    { desc: "Premium Membership", amount: "$149", date: "May 1, 2025", status: "Paid" },
    { desc: "Premium Membership", amount: "$149", date: "Apr 1, 2025", status: "Paid" },
  ];

  const tabs: { k: MaleTab; l: string }[] = [{ k: "overview", l: "Overview" }, { k: "profile", l: "My Profile" }, { k: "membership", l: "Membership" }, { k: "requests", l: "My Requests" }];

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-border" style={{ background: "#0A0813" }}>
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-0">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 bg-secondary border-2 border-primary/50 flex items-center justify-center shrink-0"><Crown className="w-7 h-7 text-primary" /></div>
            <div>
              <div className="text-[10px] tracking-[0.35em] uppercase text-primary mb-0.5">Member Dashboard</div>
              <h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal text-foreground">James Keller</h1>
              <div className="flex items-center gap-2 mt-1"><span className={`text-xs font-bold tracking-widest uppercase ${planColor[currentPlan]}`}>{currentPlan} Member</span><span className="text-muted-foreground">·</span><span className="text-xs text-muted-foreground">Active since Feb 2025</span></div>
            </div>
          </div>
          <div className="flex gap-0">{tabs.map(({ k, l }) => <button key={k} onClick={() => setTab(k)} className={`px-5 py-3 text-xs tracking-[0.2em] uppercase font-medium border-b-2 transition-colors cursor-pointer ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>)}</div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ label: "Membership", value: currentPlan, sub: "Active", icon: Crown }, { label: "Requests Used", value: `${requestsUsed}/${requestLimit}`, sub: "This month", icon: MessageCircle }, { label: "Connections Made", value: "6", sub: "Approved intros", icon: UserCheck }, { label: "Saved Profiles", value: "18", sub: "In favourites", icon: Heart }].map(({ label, value, sub, icon: Icon }) => (
                <div key={label} className="border border-border bg-card p-5"><Icon className="w-4 h-4 text-primary mb-3" /><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-medium text-foreground mb-0.5">{value}</div><div className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</div><div className="text-[10px] text-primary/70 mt-0.5">{sub}</div></div>
              ))}
            </div>
            <div className="border border-border bg-card p-6">
              <div className="flex justify-between text-sm mb-3"><span className="text-foreground font-medium">Monthly Request Allowance</span><span className="text-muted-foreground">{requestsUsed} of {requestLimit} used</span></div>
              <div className="h-2 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(requestsUsed / requestLimit) * 100}%` }} /></div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2"><span>Resets Jul 1, 2025</span><button onClick={() => goToPurchase("Elite")} className="text-primary hover:brightness-110 cursor-pointer">Upgrade for unlimited →</button></div>
            </div>
            <div className="border border-border bg-card">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-sm font-medium tracking-wide text-foreground">Recent Requests</h3><button onClick={() => setTab("requests")} className="text-xs text-primary cursor-pointer">View all →</button></div>
              <div className="divide-y divide-border">{myRequests.slice(0, 3).map((r) => <div key={r.profile} className="flex items-center justify-between px-6 py-4"><div><div className="text-sm font-medium text-foreground">{r.profile}</div><div className="text-xs text-muted-foreground">{r.date}</div></div><span className={`text-[10px] tracking-widest uppercase px-2 py-1 border ${statusBadge[r.status]}`}>{r.status}</span></div>)}</div>
            </div>
          </div>
        )}
        {tab === "profile" && (
          <div className="space-y-6">
            {saved && <div className="flex items-center gap-3 px-5 py-3 bg-emerald-950 border border-emerald-700/50 text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" />Profile saved.</div>}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-border bg-card p-6 flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-secondary border-2 border-primary/30 flex items-center justify-center"><Crown className="w-10 h-10 text-primary/50" /></div>
                <button className={ghostBtn("sm")}><Upload className="w-3.5 h-3.5" /> Upload Photo</button>
                <p className="text-[10px] text-muted-foreground text-center">Optional and private. Never shown publicly.</p>
              </div>
              <div className="md:col-span-2 border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-medium tracking-wide text-foreground">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>First Name</label><input value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} className={inp} /></div>
                  <div><label className={lbl}>Last Name</label><input value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} className={inp} /></div>
                </div>
                <div><label className={lbl}>Email Address</label><input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={inp} /></div>
                <div><label className={lbl}>Phone (Optional)</label><input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className={inp} /></div>
                <div><label className={lbl}>Location</label><input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} className={inp} /></div>
                <div><label className={lbl}>About Me (shared with approved connections)</label><textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={4} className={`${inp} resize-none`} /></div>
              </div>
            </div>
            <div className="border border-border bg-card p-6">
              <h3 className="text-sm font-medium tracking-wide text-foreground mb-4">Security</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={lbl}>Current Password</label><input type="password" placeholder="••••••••" className={inp} /></div>
                <div><label className={lbl}>New Password</label><input type="password" placeholder="••••••••" className={inp} /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button className={ghostBtn("md")}>Cancel</button>
              <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} className={goldBtn("md")}>Save Changes <Check className="w-4 h-4" /></button>
            </div>
          </div>
        )}
        {tab === "membership" && (
          <div className="space-y-6">
            <div className="border border-primary/30 bg-card p-6" style={{ background: "rgba(196,146,42,0.04)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">Current Plan</div>
                  <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-medium text-foreground">{currentPlan}</div>
                  <div className="text-sm text-muted-foreground mt-1">$149 / month · Next billing: Jul 1, 2025</div>
                </div>
                <span className="px-3 py-1 bg-emerald-950 border border-emerald-700/40 text-emerald-400 text-[10px] tracking-widest uppercase">Active</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
                {[{ label: "Requests/Month", value: "20" }, { label: "Used This Month", value: "12" }, { label: "Remaining", value: "8" }].map(({ label, value }) => <div key={label} className="text-center"><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-foreground">{value}</div><div className="text-[10px] tracking-wide text-muted-foreground">{label}</div></div>)}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {PLANS_DATA.map((p) => (
                <div key={p.name} className={`border p-5 relative ${p.name === currentPlan ? `${planBorder[p.name]} bg-primary/5` : "border-border bg-card"}`}>
                  {p.name === currentPlan && <div className="absolute top-3 right-3 text-[9px] tracking-widest uppercase text-primary border border-primary/40 px-2 py-0.5">Current</div>}
                  <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${planColor[p.name]}`}>{p.name}</div>
                  <div className="text-2xl font-semibold text-foreground mb-1">${p.monthly}<span className="text-sm text-muted-foreground">/mo</span></div>
                  <div className="text-xs text-muted-foreground mb-4">{String(p.requests)} requests/month</div>
                  {p.name !== currentPlan && <button onClick={() => goToPurchase(p.name)} className={`w-full py-2 text-[10px] tracking-widests uppercase transition-all cursor-pointer ${p.monthly > 149 ? "bg-primary text-primary-foreground hover:brightness-110" : "border border-border hover:border-primary hover:text-primary"}`}>{p.monthly > 149 ? "Upgrade" : "Downgrade"}</button>}
                </div>
              ))}
            </div>
            <div className="border border-border bg-card">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-sm font-medium tracking-wide text-foreground">Billing History</h3><button className={ghostBtn("sm")}><Download className="w-3.5 h-3.5" /> Export</button></div>
              <table className="w-full"><thead><tr className="border-b border-border">{["Description", "Amount", "Date", "Status"].map((h) => <th key={h} className="text-left px-6 py-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{billing.map((row, i) => <tr key={i} className="hover:bg-secondary/30"><td className="px-6 py-3 text-sm text-foreground">{row.desc}</td><td className="px-6 py-3 text-sm text-foreground font-semibold">{row.amount}</td><td className="px-6 py-3 text-xs text-muted-foreground">{row.date}</td><td className="px-6 py-3"><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[row.status]}`}>{row.status}</span></td></tr>)}</tbody></table>
            </div>
            <div className="border border-rose-900/30 bg-rose-950/10 p-5">
              <h4 className="text-sm font-medium text-rose-400 mb-2">Cancel Membership</h4>
              <p className="text-xs text-muted-foreground mb-4 font-light">You retain access until July 1, 2025. No refunds for partial months.</p>
              <button className="text-xs tracking-widests uppercase text-rose-500 hover:text-rose-400 border border-rose-800/50 px-4 py-2 transition-colors cursor-pointer">Request Cancellation</button>
            </div>
          </div>
        )}
        {tab === "requests" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">{requestsUsed} requests used this month of {requestLimit} included in {currentPlan}</p>
            {myRequests.map((r) => (
              <div key={r.profile} className="border border-border bg-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-secondary border border-border flex items-center justify-center"><Users className="w-4 h-4 text-muted-foreground" /></div><div><div className="text-sm font-medium text-foreground">{r.profile}</div><div className="text-xs text-muted-foreground">{r.date}</div></div></div>
                <span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

