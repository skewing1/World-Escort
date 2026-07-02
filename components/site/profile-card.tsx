"use client";

import { MapPin } from "lucide-react";
import type { Profile } from "@/lib/types";
import { verBadge, verIcon } from "@/lib/ui-styles";

export function ProfileCard({ profile, onClick }: { profile: Profile; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group relative cursor-pointer overflow-hidden border border-border transition-all duration-500 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(196,146,42,0.12)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img src={`https://images.unsplash.com/photo-${profile.photoId}?w=480&h=640&fit=crop&auto=format&q=80`} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,5,13,0.95) 0%, rgba(7,5,13,0.3) 50%, transparent 100%)" }} />
        <div className="absolute top-3 left-3"><span className={`inline-flex items-center gap-1 text-[9px] tracking-widest uppercase px-2 py-1 border font-medium ${verBadge[profile.verification]}`}>{verIcon[profile.verification]} {profile.verification}</span></div>
        {!profile.available && <div className="absolute top-3 right-3"><span className="text-[9px] tracking-widest uppercase px-2 py-1 bg-black/60 border border-white/10 text-white/40">Unavailable</span></div>}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-lg font-semibold text-white leading-tight">{profile.name}</h3>
          <div className="flex items-center gap-1.5 mt-1"><MapPin className="w-3 h-3 text-primary/80" /><span className="text-xs text-white/60">{profile.city}, {profile.country}</span><span className="text-white/30 mx-1">·</span><span className="text-xs text-white/60">{profile.age}</span></div>
          <div className="flex gap-1.5 mt-3">{profile.tags.slice(0, 2).map((t) => <span key={t} className="text-[9px] tracking-widest uppercase px-2 py-0.5 bg-white/10 text-white/60">{t}</span>)}</div>
        </div>
      </div>
    </div>
  );
}