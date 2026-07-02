"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield, Lock, Globe, MapPin, X, CheckCircle2, MessageCircle,
  UserCheck, ChevronRight, ChevronLeft,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { ProfileCard } from "@/components/site/profile-card";
import type { Profile } from "@/lib/types";
import { PROFILES_INIT } from "@/lib/mock-data";
import { goldBtn, verBadge, verIcon } from "@/lib/ui-styles";
import { routes } from "@/lib/routes";

export function ProfileDetailPage({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { userRole, goToPurchase } = useApp();
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = profile.photos ?? [profile.photoId];
  const related = PROFILES_INIT.filter((p) => p.id !== profile.id && p.country === profile.country && !p.suspended).slice(0, 3);
  const canRequest = userRole === "male" || userRole === "admin";

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-border px-6 py-3" style={{ background: "#0A0813" }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Link href={routes.browse} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"><ChevronLeft className="w-3 h-3" />Browse</Link>
          <ChevronRight className="w-3 h-3" /><span className="text-foreground">{profile.name}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary border border-border">
              <img src={`https://images.unsplash.com/photo-${photos[activePhoto]}?w=680&h=900&fit=crop&auto=format&q=85`} alt={profile.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,5,13,0.5) 0%, transparent 40%)" }} />
              <div className="absolute bottom-4 left-4"><span className={`inline-flex items-center gap-1 text-[10px] tracking-widest uppercase px-2 py-1 border font-medium ${verBadge[profile.verification]}`}>{verIcon[profile.verification]} {profile.verification}</span></div>
            </div>
            {photos.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {photos.map((pid, i) => <button key={i} onClick={() => setActivePhoto(i)} className={`aspect-square overflow-hidden border transition-all cursor-pointer ${activePhoto === i ? "border-primary" : "border-border hover:border-primary/40"}`}><img src={`https://images.unsplash.com/photo-${pid}?w=80&h=80&fit=crop&auto=format&q=60`} alt="" className="w-full h-full object-cover" /></button>)}
                <div className="aspect-square border border-dashed border-border flex items-center justify-center text-muted-foreground"><Lock className="w-4 h-4" /></div>
              </div>
            )}
            <div className="border border-border divide-y divide-border">
              {[["Age", `${profile.age} years`], ["Height", profile.height ?? "—"], ["Nationality", profile.nationality ?? profile.country], ["Languages", profile.languages.join(", ")], ["Education", profile.education ?? "—"]].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3"><span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{label}</span><span className="text-sm text-foreground font-light">{value}</span></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-4xl font-normal text-foreground">{profile.name}</h1>
                <div className="flex items-center gap-2 mt-2"><MapPin className="w-3.5 h-3.5 text-primary" /><span className="text-sm text-muted-foreground">{profile.city}, {profile.country}</span></div>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border ${profile.available ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" : "bg-rose-950 text-rose-400 border-rose-800/40"}`}>
                {profile.available ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}{profile.available ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 my-5">{profile.tags.map((t) => <span key={t} className="text-[10px] tracking-widest uppercase px-3 py-1.5 bg-secondary border border-border text-muted-foreground">{t}</span>)}</div>
            <div className="border-l-2 border-primary/40 pl-5 mb-8"><p className="text-muted-foreground leading-relaxed font-light text-sm">{profile.bio}</p></div>
            {profile.travel && <div className="mb-8"><div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Travel Availability</div><div className="flex flex-wrap gap-2">{profile.travel.map((t) => <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border"><Globe className="w-3 h-3 text-primary" /><span className="text-xs">{t}</span></div>)}</div></div>}
            <div className="border border-border p-6 mb-6" style={{ background: "rgba(196,146,42,0.04)" }}>
              <div className="mb-4">
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">Connection Request</div>
                <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-medium text-foreground mb-1">Included in Your Membership</div>
                <div className="text-xs text-muted-foreground font-light">No additional fees — requests are drawn from your monthly plan allowance.</div>
              </div>
              {canRequest ? (
                <button disabled={!profile.available} className={`${goldBtn("lg")} w-full justify-center`} style={{ opacity: profile.available ? 1 : 0.5 }}>
                  {profile.available ? <><MessageCircle className="w-4 h-4" /> Send Connection Request</> : "Currently Unavailable"}
                </button>
              ) : (
                <div className="space-y-3"><p className="text-xs text-muted-foreground text-center">A membership is required to send connection requests to female profiles.</p><button onClick={() => goToPurchase("Premium")} className={`${goldBtn("md")} w-full justify-center`}>Get Membership <ChevronRight className="w-4 h-4" /></button></div>
              )}
              <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">All requests are admin-reviewed. Contact details released only upon mutual approval.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ icon: Shield, label: "Identity Verified", desc: "Government ID checked" }, { icon: Lock, label: "Discreet Process", desc: "End-to-end privacy" }, { icon: UserCheck, label: "Admin Overseen", desc: "Every request reviewed" }].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center text-center p-4 border border-border gap-2"><Icon className="w-4 h-4 text-primary" /><div className="text-xs font-medium text-foreground">{label}</div><div className="text-[10px] text-muted-foreground">{desc}</div></div>
              ))}
            </div>
          </div>
        </div>
        {related.length > 0 && <div className="mt-16 pt-12 border-t border-border"><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal text-foreground mb-8">More from {profile.country}</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{related.map((p) => <ProfileCard key={p.id} profile={p} onClick={() => router.push(routes.profile(p.id))} />)}</div></div>}
      </div>
    </div>
  );
}