"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import { adminRoutes } from "@/lib/admin-routes";
import { PROFILES_INIT } from "@/lib/mock-data";
import { goldBtn, inp, statusBadge, verBadge, verIcon } from "@/lib/ui-styles";

export function AdminProfilesPage() {
  const [profiles, setProfiles] = useState(PROFILES_INIT);

  function toggleProfileSuspend(id: number) {
    setProfiles((p) => p.map((x) => (x.id === id ? { ...x, suspended: !x.suspended } : x)));
  }

  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Profiles" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="Search profiles…" className={`${inp} pl-9 py-2.5`} />
          </div>
          <Link href={adminRoutes.profileNew} className={goldBtn("sm")}>
            <Plus className="w-3.5 h-3.5" /> Add Profile
          </Link>
        </div>
        <div className="border border-border bg-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Profile", "Location", "Verification", "Rate", "Status", "Featured", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles.map((p) => (
                <tr key={p.id} className={`hover:bg-secondary/30 transition-colors ${p.suspended ? "opacity-50" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 overflow-hidden bg-secondary shrink-0">
                        <img src={`https://images.unsplash.com/photo-${p.photoId}?w=36&h=36&fit=crop&auto=format&q=60`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground">Age {p.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{p.city}, {p.country}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-[9px] tracking-widests uppercase px-2 py-1 border ${verBadge[p.verification]}`}>
                      {verIcon[p.verification]} {p.verification}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-primary font-semibold">${p.rate}</td>
                  <td className="px-5 py-4">
                    {p.suspended ? (
                      <span className="text-[10px] tracking-widests uppercase px-2 py-1 border bg-rose-950 text-rose-400 border-rose-800/40">Suspended</span>
                    ) : (
                      <span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${p.available ? statusBadge.Active : "bg-secondary text-muted-foreground border-border"}`}>
                        {p.available ? "Available" : "Unavailable"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className={`w-4 h-4 border flex items-center justify-center ${p.featured ? "bg-primary border-primary" : "border-border"}`}>
                      {p.featured && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 text-[10px] uppercase">
                      <Link href={adminRoutes.profile(p.id)} className="text-primary hover:brightness-110 cursor-pointer">View</Link>
                      <span className="text-border">|</span>
                      <Link href={adminRoutes.profileEdit(p.id)} className="text-muted-foreground hover:text-foreground cursor-pointer">Edit</Link>
                      <span className="text-border">|</span>
                      <button type="button" onClick={() => toggleProfileSuspend(p.id)} className={`cursor-pointer ${p.suspended ? "text-emerald-500" : "text-rose-500"}`}>
                        {p.suspended ? "Unsuspend" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
