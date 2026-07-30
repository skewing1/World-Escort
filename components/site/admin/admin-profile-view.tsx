"use client";

import Link from "next/link";
import {
  Check, ChevronLeft, ExternalLink, Globe, MapPin, Pencil, Star,
} from "lucide-react";
import { adminRoutes } from "@/lib/admin-routes";
import { routes } from "@/lib/routes";
import type { Profile } from "@/lib/types";
import { goldBtn, statusBadge, verBadge, verIcon } from "@/lib/ui-styles";

export function AdminProfileView({ profile }: { profile: Profile }) {
  const photos = profile.photos ?? [profile.photoId];

  return (
    <div>
      <Link
        href={adminRoutes.profiles}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Profiles
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="text-[10px] tracking-[0.35em] uppercase text-primary mb-1">Profile #{profile.id}</div>
          <h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground">
            {profile.name}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {profile.city}, {profile.country}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={routes.profile(profile.id)} className={goldBtn("sm")} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5" /> Public Page
          </Link>
          <Link href={adminRoutes.profileEdit(profile.id)} className={goldBtn("sm")}>
            <Pencil className="w-3.5 h-3.5" /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden bg-secondary border border-border">
            <img
              src={`https://images.unsplash.com/photo-${photos[0]}?w=680&h=900&fit=crop&auto=format&q=85`}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.slice(0, 4).map((pid, i) => (
                <div key={i} className="aspect-square overflow-hidden border border-border">
                  <img
                    src={`https://images.unsplash.com/photo-${pid}?w=80&h=80&fit=crop&auto=format&q=60`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Verification</span>
              <span className={`inline-flex items-center gap-1 text-[9px] tracking-widests uppercase px-2 py-1 border ${verBadge[profile.verification]}`}>
                {verIcon[profile.verification]} {profile.verification}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              {profile.suspended ? (
                <span className="text-[10px] tracking-widests uppercase px-2 py-1 border bg-rose-950 text-rose-400 border-rose-800/40">Suspended</span>
              ) : (
                <span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${profile.available ? statusBadge.Active : "bg-secondary text-muted-foreground border-border"}`}>
                  {profile.available ? "Available" : "Unavailable"}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Featured</span>
              <div className={`w-4 h-4 border flex items-center justify-center ${profile.featured ? "bg-primary border-primary" : "border-border"}`}>
                {profile.featured && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Rate</span>
              <span className="text-primary font-semibold">${profile.rate}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border bg-card p-6">
            <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-4">Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["Age", `${profile.age} years`],
                ["Height", profile.height ?? "—"],
                ["Nationality", profile.nationality ?? profile.country],
                ["Education", profile.education ?? "—"],
                ["Languages", profile.languages.join(", ") || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{label}</span>
                  <span className="text-sm text-foreground font-light">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-card p-6">
            <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-3">Bio</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">{profile.bio || "—"}</p>
          </div>

          {profile.tags.length > 0 && (
            <div className="border border-border bg-card p-6">
              <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span key={tag} className="text-[10px] tracking-widests uppercase px-3 py-1.5 bg-secondary border border-border text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.travel && profile.travel.length > 0 && (
            <div className="border border-border bg-card p-6">
              <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-3 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-primary" /> Travel Availability
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.travel.map((t) => (
                  <span key={t} className="text-xs px-3 py-1.5 bg-secondary border border-border">{t}</span>
                ))}
              </div>
            </div>
          )}

          {profile.featured && (
            <div className="flex items-center gap-2 text-xs text-primary border border-primary/30 bg-primary/5 px-4 py-3">
              <Star className="w-4 h-4" /> This profile is featured on the browse page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
