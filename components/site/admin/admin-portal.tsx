"use client";

import { useState } from "react";
import {
  Search, Star, Users, DollarSign, AlertCircle, Check, X, Plus,
  UserCheck, MessageCircle, ArrowRight, FileText, Camera, Sliders, CheckCircle2,
} from "lucide-react";
import { AdminMemberView } from "@/components/site/admin/admin-member-view";
import { AdminProfileEdit } from "@/components/site/admin/admin-profile-edit";
import type { AdminSubView, AdminTab, Profile } from "@/lib/types";
import {
  CONN_REQS_INIT, MEMBERS_INIT, PENDING_APPROVALS_INIT, PLANS_DATA, PROFILES_INIT,
} from "@/lib/mock-data";
import {
  goldBtn, inp, lbl, planColor, statusBadge, verBadge, verIcon,
} from "@/lib/ui-styles";

export function AdminPortal() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [subView, setSubView] = useState<AdminSubView>(null);
  const [profiles, setProfiles] = useState(PROFILES_INIT);
  const [members, setMembers] = useState(MEMBERS_INIT);
  const [pending, setPending] = useState(PENDING_APPROVALS_INIT);
  const [connReqs, setConnReqs] = useState(CONN_REQS_INIT);
  const [plansSaved, setPlansSaved] = useState(false);

  function toggleMemberSuspend(id: number) { setMembers((m) => m.map((x) => x.id === id ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" } : x)); }
  function toggleProfileSuspend(id: number) { setProfiles((p) => p.map((x) => x.id === id ? { ...x, suspended: !x.suspended } : x)); }
  function saveProfile(data: Partial<Profile>) {
    if (subView?.type === "profile-edit" && subView.id === "new") {
      setProfiles((p) => [...p, { id: Date.now(), photoId: "1529626455594-4ff0802cfb7e", ...data } as Profile]);
    } else if (subView?.type === "profile-edit" && typeof subView.id === "number") {
      setProfiles((p) => p.map((x) => x.id === (subView as { type: string; id: number }).id ? { ...x, ...data } : x));
    }
  }

  const pendingTotal = pending.length + connReqs.filter(r => r.status === "pending").length;

  if (subView?.type === "member-view") {
    const member = members.find((m) => m.id === subView.id);
    if (!member) return null;
    return (
      <div className="pt-16 min-h-screen">
        <div className="border-b border-border" style={{ background: "#0A0813" }}><div className="max-w-7xl mx-auto px-6 py-4"><div className="text-[10px] tracking-[0.35em] uppercase text-primary">Admin · Members · Member View</div></div></div>
        <div className="max-w-7xl mx-auto px-6 py-8"><AdminMemberView member={member} onBack={() => setSubView(null)} onToggleSuspend={() => { toggleMemberSuspend(member.id); setSubView(null); }} /></div>
      </div>
    );
  }

  if (subView?.type === "profile-edit") {
    const isNew = subView.id === "new";
    const profile = isNew ? null : profiles.find((p) => p.id === subView.id) ?? null;
    return (
      <div className="pt-16 min-h-screen">
        <div className="border-b border-border" style={{ background: "#0A0813" }}><div className="max-w-7xl mx-auto px-6 py-4"><div className="text-[10px] tracking-[0.35em] uppercase text-primary">Admin · Profiles · {isNew ? "Add Profile" : "Edit Profile"}</div></div></div>
        <div className="max-w-7xl mx-auto px-6 py-8"><AdminProfileEdit profile={profile} isNew={isNew} onBack={() => setSubView(null)} onSave={saveProfile} /></div>
      </div>
    );
  }

  const tabs: { k: AdminTab; l: string }[] = [
    { k: "overview", l: "Overview" }, { k: "users", l: "Members" }, { k: "profiles", l: "Profiles" },
    { k: "approvals", l: `Approvals (${pendingTotal})` }, { k: "plans", l: "Plans & Settings" }, { k: "analytics", l: "Analytics" },
  ];

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-border" style={{ background: "#0A0813" }}>
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
          <div className="flex items-end justify-between mb-6">
            <div><div className="text-[10px] tracking-[0.35em] uppercase text-primary mb-1">Administration</div><h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground">Admin Portal</h1></div>
            <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <div className="flex gap-0 overflow-x-auto">{tabs.map(({ k, l }) => <button key={k} onClick={() => setTab(k)} className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>)}</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ label: "Total Members", value: String(members.length + 12840), change: "+8.3%", icon: Users, up: true }, { label: "Monthly Revenue", value: "$284,500", change: "+12.1%", icon: DollarSign, up: true }, { label: "Active Profiles", value: String(profiles.filter(p => !p.suspended).length), change: "+4.7%", icon: Star, up: true }, { label: "Pending Approvals", value: String(pendingTotal), change: "Needs action", icon: AlertCircle, up: false }].map(({ label, value, change, icon: Icon, up }) => (
                <div key={label} className="border border-border bg-card p-6">
                  <div className="flex items-start justify-between mb-4"><Icon className="w-5 h-5 text-primary" /><span className={`text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>{change}</span></div>
                  <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-medium text-foreground mb-1">{value}</div>
                  <div className="text-[10px] tracking-widests uppercase text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border bg-card">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-sm font-medium tracking-wide text-foreground">Profile Approvals</h3><button onClick={() => setTab("approvals")} className="text-xs text-primary cursor-pointer">View all →</button></div>
                <div className="divide-y divide-border">
                  {pending.slice(0, 4).map((p) => <div key={p.id} className="flex items-center justify-between px-6 py-3.5"><div><div className="text-sm font-medium text-foreground">{p.name}</div><div className="text-xs text-muted-foreground">{p.age} · {p.city}, {p.country} · {p.submitted}</div></div><div className="flex gap-2"><button onClick={() => setPending(pp => pp.filter(x => x.id !== p.id))} className="w-7 h-7 bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button><button onClick={() => setPending(pp => pp.filter(x => x.id !== p.id))} className="w-7 h-7 bg-rose-950 border border-rose-800/50 flex items-center justify-center text-rose-400 cursor-pointer"><X className="w-3.5 h-3.5" /></button></div></div>)}
                  {pending.length === 0 && <div className="px-6 py-8 text-center text-muted-foreground text-sm"><CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-600" />All caught up</div>}
                </div>
              </div>
              <div className="border border-border bg-card">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-sm font-medium tracking-wide text-foreground">Connection Requests</h3><button onClick={() => setTab("approvals")} className="text-xs text-primary cursor-pointer">View all →</button></div>
                <div className="divide-y divide-border">{connReqs.filter(r => r.status === "pending").slice(0, 4).map((r) => <div key={r.id} className="px-6 py-3.5 flex items-center justify-between gap-4"><div><div className="text-xs font-medium text-foreground">{r.from} → {r.profile}</div><div className="text-[10px] text-muted-foreground">{r.submitted}</div></div><div className="flex gap-2"><button onClick={() => setConnReqs(rr => rr.map(x => x.id === r.id ? { ...x, status: "approved" } : x))} className="px-2.5 py-1 text-[10px] uppercase bg-emerald-950 border border-emerald-700/50 text-emerald-400 cursor-pointer">Approve</button><button onClick={() => setConnReqs(rr => rr.map(x => x.id === r.id ? { ...x, status: "rejected" } : x))} className="px-2.5 py-1 text-[10px] uppercase bg-rose-950 border border-rose-800/50 text-rose-400 cursor-pointer">Reject</button></div></div>)}</div>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div className="relative w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><input placeholder="Search members…" className={`${inp} pl-9 py-2.5`} /></div></div>
            <div className="border border-border bg-card overflow-x-auto">
              <table className="w-full"><thead><tr className="border-b border-border">{["Member", "Country", "Plan", "Requests", "Total Spend", "Joined", "Status", "Actions"].map((h) => <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">{members.map((m) => (
                  <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4"><div className="text-sm font-medium text-foreground">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{m.country}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-medium ${planColor[m.plan]}`}>{m.plan}</span></td>
                    <td className="px-5 py-4 text-xs text-foreground">{m.requests}</td>
                    <td className="px-5 py-4 text-sm text-foreground font-semibold">{m.spend}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{m.joined}</td>
                    <td className="px-5 py-4"><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[m.status]}`}>{m.status}</span></td>
                    <td className="px-5 py-4"><div className="flex gap-2 text-[10px] uppercase"><button onClick={() => setSubView({ type: "member-view", id: m.id })} className="text-primary hover:brightness-110 cursor-pointer">View</button><span className="text-border">|</span><button onClick={() => toggleMemberSuspend(m.id)} className={`cursor-pointer ${m.status === "Active" ? "text-rose-500 hover:text-rose-400" : "text-emerald-500 hover:text-emerald-400"}`}>{m.status === "Active" ? "Suspend" : "Activate"}</button></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "profiles" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div className="relative w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><input placeholder="Search profiles…" className={`${inp} pl-9 py-2.5`} /></div><button onClick={() => setSubView({ type: "profile-edit", id: "new" })} className={goldBtn("sm")}><Plus className="w-3.5 h-3.5" /> Add Profile</button></div>
            <div className="border border-border bg-card overflow-x-auto">
              <table className="w-full"><thead><tr className="border-b border-border">{["Profile", "Location", "Verification", "Rate", "Status", "Featured", "Actions"].map((h) => <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">{profiles.map((p) => (
                  <tr key={p.id} className={`hover:bg-secondary/30 transition-colors ${p.suspended ? "opacity-50" : ""}`}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 overflow-hidden bg-secondary shrink-0"><img src={`https://images.unsplash.com/photo-${p.photoId}?w=36&h=36&fit=crop&auto=format&q=60`} alt="" className="w-full h-full object-cover" /></div><div><div className="text-sm font-medium text-foreground">{p.name}</div><div className="text-xs text-muted-foreground">Age {p.age}</div></div></div></td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{p.city}, {p.country}</td>
                    <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 text-[9px] tracking-widests uppercase px-2 py-1 border ${verBadge[p.verification]}`}>{verIcon[p.verification]} {p.verification}</span></td>
                    <td className="px-5 py-4 text-sm text-primary font-semibold">${p.rate}</td>
                    <td className="px-5 py-4">{p.suspended ? <span className="text-[10px] tracking-widests uppercase px-2 py-1 border bg-rose-950 text-rose-400 border-rose-800/40">Suspended</span> : <span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${p.available ? statusBadge.Active : "bg-secondary text-muted-foreground border-border"}`}>{p.available ? "Available" : "Unavailable"}</span>}</td>
                    <td className="px-5 py-4"><div className={`w-4 h-4 border flex items-center justify-center ${p.featured ? "bg-primary border-primary" : "border-border"}`}>{p.featured && <Check className="w-2.5 h-2.5 text-primary-foreground" />}</div></td>
                    <td className="px-5 py-4"><div className="flex gap-2 text-[10px] uppercase"><button onClick={() => setSubView({ type: "profile-edit", id: p.id })} className="text-muted-foreground hover:text-foreground cursor-pointer">Edit</button><span className="text-border">|</span><button onClick={() => toggleProfileSuspend(p.id)} className={`cursor-pointer ${p.suspended ? "text-emerald-500" : "text-rose-500"}`}>{p.suspended ? "Unsuspend" : "Suspend"}</button></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "approvals" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-medium tracking-widests uppercase text-muted-foreground mb-4 flex items-center gap-2"><UserCheck className="w-4 h-4 text-primary" />Profile Verification Queue ({pending.length})</h2>
              {pending.length === 0 ? <div className="border border-border bg-card p-10 text-center text-muted-foreground"><CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" /><p className="text-sm">All applications reviewed</p></div>
                : <div className="space-y-3">{pending.map((p) => <div key={p.id} className="border border-border bg-card p-5 flex items-start justify-between gap-4"><div className="flex items-start gap-4 flex-1"><div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-muted-foreground" /></div><div className="flex-1"><div className="flex items-center gap-3 mb-2"><span className="text-sm font-medium text-foreground">{p.name}</span><span className="text-xs text-muted-foreground">{p.age} · {p.city}, {p.country} · {p.submitted}</span></div><div className="flex items-center gap-3"><span className={`inline-flex items-center gap-1 text-[10px] uppercase px-2 py-1 border ${p.docs ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" : "bg-rose-950 text-rose-400 border-rose-800/40"}`}><FileText className="w-2.5 h-2.5" /> ID {p.docs ? "✓" : "✗"}</span><span className={`inline-flex items-center gap-1 text-[10px] uppercase px-2 py-1 border ${p.selfie ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" : "bg-rose-950 text-rose-400 border-rose-800/40"}`}><Camera className="w-2.5 h-2.5" /> Selfie {p.selfie ? "✓" : "✗"}</span>{(!p.docs || !p.selfie) && <span className="text-[10px] text-amber-400">⚠ Incomplete</span>}</div></div></div><div className="flex items-center gap-2 shrink-0"><button onClick={() => setPending(pp => pp.filter(x => x.id !== p.id))} className="px-4 py-2 text-[10px] uppercase bg-emerald-950 border border-emerald-700/50 text-emerald-400 cursor-pointer">Approve</button><button onClick={() => setPending(pp => pp.filter(x => x.id !== p.id))} className="px-4 py-2 text-[10px] uppercase bg-rose-950 border border-rose-800/50 text-rose-400 cursor-pointer">Reject</button></div></div>)}</div>}
            </div>
            <div>
              <h2 className="text-xs font-medium tracking-widests uppercase text-muted-foreground mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" />Connection Requests ({connReqs.filter(r => r.status === "pending").length} pending)</h2>
              <div className="space-y-3">{connReqs.map((r) => <div key={r.id} className="border border-border bg-card p-5 flex items-start justify-between gap-4"><div className="flex-1"><div className="flex items-center gap-3 mb-1"><span className="text-sm font-medium text-foreground">{r.from}</span><ArrowRight className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-sm font-medium text-foreground">{r.profile}</span></div><p className="text-xs text-muted-foreground italic font-light border-l-2 border-border pl-3 mb-2">"{r.message}"</p><div className="text-[10px] text-muted-foreground">{r.submitted}</div></div><div className="flex flex-col items-end gap-2 shrink-0"><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[r.status]}`}>{r.status}</span>{r.status === "pending" && <div className="flex gap-2"><button onClick={() => setConnReqs(rr => rr.map(x => x.id === r.id ? { ...x, status: "approved" } : x))} className="px-3 py-1.5 text-[10px] uppercase bg-emerald-950 border border-emerald-700/50 text-emerald-400 cursor-pointer">Approve</button><button onClick={() => setConnReqs(rr => rr.map(x => x.id === r.id ? { ...x, status: "rejected" } : x))} className="px-3 py-1.5 text-[10px] uppercase bg-rose-950 border border-rose-800/50 text-rose-400 cursor-pointer">Reject</button></div>}</div></div>)}</div>
            </div>
          </div>
        )}

        {tab === "plans" && (
          <div className="space-y-6">
            {plansSaved && <div className="flex items-center gap-3 px-5 py-3 bg-emerald-950 border border-emerald-700/50 text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" />Settings saved.</div>}
            <div className="grid md:grid-cols-3 gap-5">{PLANS_DATA.map((plan) => <div key={plan.name} className="border border-border bg-card p-6"><div className={`text-xs font-bold tracking-widests uppercase mb-4 ${planColor[plan.name]}`}>{plan.name}</div><div className="space-y-3"><div><label className={lbl}>Monthly Price ($)</label><input type="number" defaultValue={plan.monthly} className={`${inp} py-2`} /></div><div><label className={lbl}>Annual Price ($/mo)</label><input type="number" defaultValue={plan.annual} className={`${inp} py-2`} /></div><div><label className={lbl}>Requests/Month</label><input defaultValue={String(plan.requests)} className={`${inp} py-2`} /></div></div></div>)}</div>
            <div className="border border-border bg-card p-6">
              <h3 className="text-sm font-medium tracking-wide text-foreground mb-5 flex items-center gap-2"><Sliders className="w-4 h-4 text-primary" />Platform Settings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><label className={lbl}>Platform Commission (%)</label><input type="number" defaultValue={20} className={`${inp} py-2`} /></div>
                  <div><div className={lbl}>Accepted Crypto</div>{["Bitcoin (BTC)", "Ethereum (ETH)", "USDT", "USDC"].map((c) => <label key={c} className="flex items-center gap-2.5 cursor-pointer mb-2"><div className="w-4 h-4 border border-primary bg-primary/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-primary" /></div><span className="text-xs text-foreground">{c}</span></label>)}</div>
                </div>
                <div><div className={lbl}>Email Notifications</div>{["New registrations", "Profile approvals", "Connection requests", "Daily revenue"].map((n) => <label key={n} className="flex items-center gap-2.5 cursor-pointer mb-2"><div className="w-4 h-4 border border-primary bg-primary/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-primary" /></div><span className="text-xs text-foreground">{n}</span></label>)}</div>
              </div>
            </div>
            <div className="flex justify-end"><button onClick={() => { setPlansSaved(true); setTimeout(() => setPlansSaved(false), 3000); }} className={goldBtn("md")}>Save Settings <Check className="w-4 h-4" /></button></div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border bg-card p-6">
                <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Monthly Revenue</h3>
                <div className="flex items-end gap-2 h-40">
                  {[{ m: "Jan", v: 180 }, { m: "Feb", v: 210 }, { m: "Mar", v: 195 }, { m: "Apr", v: 230 }, { m: "May", v: 248 }, { m: "Jun", v: 284 }].map(({ m, v }) => <div key={m} className="flex-1 flex flex-col items-center gap-1"><div className="text-[9px] text-muted-foreground">${v}k</div><div className="w-full relative" style={{ height: `${(v / 300) * 128}px`, background: "rgba(196,146,42,0.15)" }}><div className="absolute inset-0 bg-primary/80 hover:bg-primary transition-colors" /></div><div className="text-[9px] text-muted-foreground">{m}</div></div>)}
                </div>
              </div>
              <div className="border border-border bg-card p-6">
                <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Members by Plan</h3>
                <div className="space-y-4">{[{ label: "Elite", value: 3241, total: 12847, color: "bg-purple-500" }, { label: "Premium", value: 5102, total: 12847, color: "bg-primary" }, { label: "Bronze", value: 4504, total: 12847, color: "bg-amber-600" }].map(({ label, value, total, color }) => <div key={label}><div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">{label}</span><span className="text-foreground font-medium">{value.toLocaleString()}</span></div><div className="h-2 bg-muted"><div className={`h-full ${color}`} style={{ width: `${(value / total) * 100}%` }} /></div></div>)}</div>
                <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center"><div><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-foreground">+847</div><div className="text-[10px] tracking-wide text-muted-foreground">New this month</div></div><div><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-foreground">91%</div><div className="text-[10px] tracking-wide text-muted-foreground">Retention rate</div></div></div>
              </div>
              <div className="border border-border bg-card p-6">
                <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Top Member Countries</h3>
                <div className="space-y-3">{[{ country: "United States", count: 3241, pct: 25 }, { country: "United Kingdom", count: 1876, pct: 15 }, { country: "Germany", count: 1543, pct: 12 }, { country: "Australia", count: 1102, pct: 9 }, { country: "Switzerland", count: 987, pct: 8 }].map(({ country, count, pct }) => <div key={country} className="flex items-center gap-4"><div className="w-28 shrink-0 text-xs text-muted-foreground truncate">{country}</div><div className="flex-1 h-1.5 bg-muted"><div className="h-full bg-primary" style={{ width: `${pct * 4}%` }} /></div><div className="w-12 text-right text-xs text-foreground">{count.toLocaleString()}</div></div>)}</div>
              </div>
              <div className="border border-border bg-card p-6">
                <h3 className="text-sm font-medium tracking-wide text-foreground mb-6">Conversion Metrics</h3>
                <div className="grid grid-cols-2 gap-3">{[{ label: "Browse → Request", value: "12.4%", trend: "↑ 2.1%" }, { label: "Request → Approval", value: "68.7%", trend: "↑ 5.3%" }, { label: "Visit → Register", value: "8.2%", trend: "↓ 0.4%" }, { label: "Free → Paid", value: "34.5%", trend: "↑ 1.8%" }].map(({ label, value, trend }) => <div key={label} className="border border-border p-4"><div className="text-[10px] tracking-widests uppercase text-muted-foreground mb-1">{label}</div><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl text-foreground">{value}</div><div className={`text-[10px] mt-0.5 ${trend.startsWith("↑") ? "text-emerald-400" : "text-rose-400"}`}>{trend}</div></div>)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

