"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Check } from "lucide-react";
import { ProfileCard } from "@/components/site/profile-card";
import { COUNTRIES, PROFILES_INIT, VERIFICATIONS } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function BrowsePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [verification, setVerification] = useState("All");
  const [maxRate, setMaxRate] = useState(1000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rate" | "age" | "name">("name");
  const filtered = useMemo(() => {
    let list = PROFILES_INIT.filter(p => !p.suspended);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase()));
    if (country !== "All") list = list.filter((p) => p.country === country);
    if (verification !== "All") list = list.filter((p) => p.verification === verification);
    list = list.filter((p) => p.rate <= maxRate);
    if (availableOnly) list = list.filter((p) => p.available);
    list.sort((a, b) => sortBy === "rate" ? a.rate - b.rate : sortBy === "age" ? a.age - b.age : a.name.localeCompare(b.name));
    return list;
  }, [search, country, verification, maxRate, availableOnly, sortBy]);
  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-border px-6 py-4" style={{ background: "#0A0813" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div><h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal text-foreground">Browse Profiles</h1><p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {PROFILES_INIT.filter(p => !p.suspended).length} profiles</p></div>
          <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, city…" className="w-full bg-secondary border border-border pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" /></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="shrink-0 w-52 hidden md:block">
          <div className="sticky top-24 space-y-6">
            <div><div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Country</div><div className="space-y-1 max-h-48 overflow-y-auto">{COUNTRIES.map((c) => <button key={c} onClick={() => setCountry(c)} className={`block w-full text-left text-xs px-2 py-1.5 transition-colors cursor-pointer ${country === c ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>)}</div></div>
            <div className="border-t border-border pt-6"><div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Verification</div>{VERIFICATIONS.map((v) => <button key={v} onClick={() => setVerification(v)} className={`block w-full text-left text-xs px-2 py-1.5 transition-colors cursor-pointer ${verification === v ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>{v}</button>)}</div>
            <div className="border-t border-border pt-6"><div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Max Rate: ${maxRate}</div><input type="range" min={100} max={1000} step={50} value={maxRate} onChange={(e) => setMaxRate(Number(e.target.value))} className="w-full accent-[#C4922A]" /><div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>$100</span><span>$1,000</span></div></div>
            <div className="border-t border-border pt-6"><label className="flex items-center gap-2.5 cursor-pointer"><div onClick={() => setAvailableOnly(!availableOnly)} className={`w-4 h-4 border flex items-center justify-center transition-colors ${availableOnly ? "bg-primary border-primary" : "border-border"}`}>{availableOnly && <Check className="w-2.5 h-2.5 text-primary-foreground" />}</div><span className="text-xs text-muted-foreground">Available only</span></label></div>
            <div className="border-t border-border pt-6"><div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Sort By</div>{[{ v: "name", l: "Name" }, { v: "rate", l: "Rate: Low–High" }, { v: "age", l: "Age: Young–Old" }].map(({ v, l }) => <button key={v} onClick={() => setSortBy(v as typeof sortBy)} className={`block w-full text-left text-xs px-2 py-1.5 transition-colors cursor-pointer ${sortBy === v ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>)}</div>
          </div>
        </aside>
        <div className="flex-1">{filtered.length === 0 ? <div className="text-center py-20 text-muted-foreground text-sm">No profiles match your filters.</div> : <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{filtered.map((p) => <ProfileCard key={p.id} profile={p} onClick={() => router.push(routes.profile(p.id))} />)}</div>}</div>
      </div>
    </div>
  );
}

