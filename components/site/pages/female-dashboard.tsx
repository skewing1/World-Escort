"use client";

import { useState } from "react";
import {
  Crown, Eye, MessageCircle, UserCheck, Check, Plus, Download, CheckCircle2,
} from "lucide-react";
import type { FemaleTab } from "@/lib/types";
import { PROFILES_INIT } from "@/lib/mock-data";
import {
  ghostBtn, goldBtn, inp, lbl, statusBadge, verBadge, verIcon,
} from "@/lib/ui-styles";

export function FemaleDashboard() {
  const [tab, setTab] = useState<FemaleTab>("overview");
  const [requests, setRequests] = useState([
    { id: 1, from: "James K.", plan: "Elite", submitted: "Today, 14:32", status: "pending", message: "I'd love to make a formal introduction. I travel to Milan frequently." },
    { id: 2, from: "Robert M.", plan: "Premium", submitted: "Today, 09:17", status: "pending", message: "I'm an avid art collector. I spend several months a year in Milan." },
    { id: 3, from: "Michael H.", plan: "Elite", submitted: "Yesterday", status: "approved", message: "We share mutual friends in the finance world." },
    { id: 4, from: "David L.", plan: "Bronze", submitted: "2 days ago", status: "rejected", message: "Hello, I am interested in an introduction." },
  ]);
  const me = PROFILES_INIT[0];
  const [available, setAvailable] = useState(me.available);
  const [bio, setBio] = useState(me.bio);
  const [saved, setSaved] = useState(false);

  function approve(id: number) { setRequests((r) => r.map((x) => x.id === id ? { ...x, status: "approved" } : x)); }
  function reject(id: number) { setRequests((r) => r.map((x) => x.id === id ? { ...x, status: "rejected" } : x)); }
  const tabs: { k: FemaleTab; l: string }[] = [{ k: "overview", l: "Overview" }, { k: "profile", l: "My Profile" }, { k: "requests", l: `Requests (${requests.filter(r => r.status === "pending").length})` }, { k: "earnings", l: "Earnings" }];

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-border" style={{ background: "#0A0813" }}>
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-0">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 overflow-hidden border-2 border-primary/50 bg-secondary shrink-0"><img src={`https://images.unsplash.com/photo-${me.photoId}?w=64&h=64&fit=crop&auto=format`} alt={me.name} className="w-full h-full object-cover" /></div>
            <div>
              <div className="text-[10px] tracking-[0.35em] uppercase text-primary mb-0.5">Member Dashboard</div>
              <h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal text-foreground">{me.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 text-[9px] tracking-widests uppercase px-2 py-1 border ${verBadge[me.verification]}`}>{verIcon[me.verification]} {me.verification}</span>
                <span className={`text-[9px] tracking-widests uppercase px-2 py-1 border ${available ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" : "bg-rose-950 text-rose-400 border-rose-800/40"}`}>{available ? "Available" : "Unavailable"}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-0">{tabs.map(({ k, l }) => <button key={k} onClick={() => setTab(k)} className={`px-5 py-3 text-xs tracking-[0.2em] uppercase font-medium border-b-2 transition-colors cursor-pointer ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>)}</div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ label: "Profile Views", value: "1,284", sub: "+18% this month", icon: Eye }, { label: "Requests", value: "24", sub: `${requests.filter(r => r.status === "pending").length} pending`, icon: MessageCircle }, { label: "Connections Made", value: "16", sub: "Approved intros", icon: UserCheck }, { label: "Profile Status", value: "VIP", sub: "Active & visible", icon: Crown }].map(({ label, value, sub, icon: Icon }) => (
                <div key={label} className="border border-border bg-card p-5"><Icon className="w-4 h-4 text-primary mb-3" /><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-medium text-foreground mb-0.5">{value}</div><div className="text-[10px] tracking-widests uppercase text-muted-foreground">{label}</div><div className="text-[10px] text-primary/70 mt-0.5">{sub}</div></div>
              ))}
            </div>
            <div className="border border-border bg-card">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-sm font-medium tracking-wide text-foreground">Pending Requests</h3><button onClick={() => setTab("requests")} className="text-xs text-primary cursor-pointer">View all →</button></div>
              {requests.filter(r => r.status === "pending").length === 0
                ? <div className="px-6 py-10 text-center text-muted-foreground text-sm">No pending requests</div>
                : <div className="divide-y divide-border">{requests.filter(r => r.status === "pending").map((r) => (
                  <div key={r.id} className="px-6 py-4 flex items-start justify-between gap-4">
                    <div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="text-sm font-medium text-foreground">{r.from}</span><span className={`text-[9px] tracking-widests uppercase px-2 py-0.5 border ${r.plan === "Elite" ? "bg-purple-950 text-purple-300 border-purple-700/40" : "bg-amber-950 text-amber-300 border-amber-700/40"}`}>{r.plan}</span></div><p className="text-xs text-muted-foreground italic font-light line-clamp-1">"{r.message}"</p></div>
                    <div className="flex gap-2 shrink-0"><button onClick={() => approve(r.id)} className="px-3 py-1.5 text-[10px] tracking-widests uppercase bg-emerald-950 border border-emerald-700/50 text-emerald-400 cursor-pointer">Accept</button><button onClick={() => reject(r.id)} className="px-3 py-1.5 text-[10px] tracking-widests uppercase bg-rose-950 border border-rose-800/50 text-rose-400 cursor-pointer">Decline</button></div>
                  </div>
                ))}</div>}
            </div>
          </div>
        )}
        {tab === "profile" && (
          <div className="space-y-6">
            {saved && <div className="flex items-center gap-3 px-5 py-3 bg-emerald-950 border border-emerald-700/50 text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" />Saved.</div>}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-border bg-card p-5">
                <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-4">Photos</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">{(me.photos ?? [me.photoId]).map((pid, i) => <div key={i} className="relative aspect-square overflow-hidden bg-secondary border border-border cursor-pointer"><img src={`https://images.unsplash.com/photo-${pid}?w=120&h=120&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />{i === 0 && <div className="absolute bottom-0 left-0 right-0 py-0.5 bg-primary/80 text-[8px] text-center text-primary-foreground">Main</div>}</div>)}<button className="aspect-square border border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"><Plus className="w-5 h-5" /></button></div>
                <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-3 mt-5">Availability</h3>
                <button onClick={() => setAvailable(!available)} className="flex items-center gap-3 cursor-pointer"><div className={`w-10 h-5 relative transition-colors ${available ? "bg-primary" : "bg-border"}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-foreground transition-transform ${available ? "translate-x-5" : ""}`} /></div><span className={`text-xs font-medium ${available ? "text-emerald-400" : "text-muted-foreground"}`}>{available ? "Available" : "Unavailable"}</span></button>
              </div>
              <div className="md:col-span-2 border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-medium tracking-wide text-foreground">Profile Details</h3>
                <div><label className={lbl}>About Me</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className={`${inp} resize-none`} /></div>
                <div className="grid grid-cols-2 gap-4"><div><label className={lbl}>City</label><input defaultValue={me.city} className={inp} /></div><div><label className={lbl}>Country</label><input defaultValue={me.country} className={inp} /></div></div>
                <div><label className={lbl}>Languages</label><input defaultValue={me.languages.join(", ")} className={inp} /></div>
              </div>
            </div>
            <div className="flex justify-end"><button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} className={goldBtn("md")}>Save Changes <Check className="w-4 h-4" /></button></div>
          </div>
        )}
        {tab === "requests" && (
          <div className="space-y-4">{requests.map((r) => (
            <div key={r.id} className="border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1"><div className="flex items-center gap-3 mb-2"><span className="text-sm font-medium text-foreground">{r.from}</span><span className={`text-[9px] tracking-widests uppercase px-2 py-0.5 border ${r.plan === "Elite" ? "bg-purple-950 text-purple-300 border-purple-700/40" : "bg-amber-950 text-amber-300 border-amber-700/40"}`}>{r.plan} Member</span></div><p className="text-sm text-muted-foreground italic font-light border-l-2 border-border pl-3 mb-2">"{r.message}"</p><div className="text-[10px] text-muted-foreground">{r.submitted}</div></div>
                <div className="flex flex-col items-end gap-2 shrink-0"><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[r.status]}`}>{r.status}</span>{r.status === "pending" && <div className="flex gap-2"><button onClick={() => approve(r.id)} className="px-3 py-1.5 text-[10px] uppercase bg-emerald-950 border border-emerald-700/50 text-emerald-400 cursor-pointer">Accept</button><button onClick={() => reject(r.id)} className="px-3 py-1.5 text-[10px] uppercase bg-rose-950 border border-rose-800/50 text-rose-400 cursor-pointer">Decline</button></div>}</div>
              </div>
            </div>
          ))}</div>
        )}
        {tab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">{[{ label: "Total Earned", value: "$6,400", sub: "Since joining" }, { label: "This Month", value: "$1,200", sub: "3 connections" }, { label: "Pending", value: "$400", sub: "Processing" }].map(({ label, value, sub }) => <div key={label} className="border border-border bg-card p-6"><div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">{label}</div><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-medium text-primary mb-1">{value}</div><div className="text-xs text-muted-foreground">{sub}</div></div>)}</div>
            <div className="border border-border bg-card">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between"><h3 className="text-sm font-medium tracking-wide text-foreground">Payout History</h3><button className={ghostBtn("sm")}><Download className="w-3.5 h-3.5" /> Export</button></div>
              <table className="w-full"><thead><tr className="border-b border-border">{["Connection", "Amount", "Status", "Date"].map((h) => <th key={h} className="text-left px-6 py-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{[{ c: "Connection #16", a: "$400", s: "Paid", d: "Jun 2, 2025" }, { c: "Connection #15", a: "$400", s: "Paid", d: "May 19, 2025" }, { c: "Connection #14", a: "$400", s: "Paid", d: "Apr 30, 2025" }].map((row) => <tr key={row.c} className="hover:bg-secondary/30"><td className="px-6 py-3 text-sm text-foreground">{row.c}</td><td className="px-6 py-3 text-sm text-primary font-semibold">{row.a}</td><td className="px-6 py-3"><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[row.s]}`}>{row.s}</span></td><td className="px-6 py-3 text-xs text-muted-foreground">{row.d}</td></tr>)}</tbody></table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

