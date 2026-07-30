"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, Check, CheckCircle2, DollarSign, Star, Users, X,
} from "lucide-react";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import { adminRoutes } from "@/lib/admin-routes";
import { MEMBERS_INIT, PENDING_APPROVALS_INIT, PROFILES_INIT } from "@/lib/mock-data";

export function AdminOverviewPage() {
  const [pending, setPending] = useState(PENDING_APPROVALS_INIT);
  const [pendingConnCount, setPendingConnCount] = useState(0);
  const members = MEMBERS_INIT;
  const profiles = PROFILES_INIT;
  const pendingApprovalCount = pending.length;

  useEffect(() => {
    void fetch("/api/connection-requests?status=pending")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.total != null) setPendingConnCount(data.total);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Overview" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: String(members.length + 12840), change: "+8.3%", icon: Users, up: true },
            { label: "Monthly Revenue", value: "$284,500", change: "+12.1%", icon: DollarSign, up: true },
            { label: "Active Profiles", value: String(profiles.filter((p) => !p.suspended).length), change: "+4.7%", icon: Star, up: true },
            { label: "Pending Actions", value: String(pendingApprovalCount + pendingConnCount), change: "Needs action", icon: AlertCircle, up: false },
          ].map(({ label, value, change, icon: Icon, up }) => (
            <div key={label} className="border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <span className={`text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>{change}</span>
              </div>
              <div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-medium text-foreground mb-1">{value}</div>
              <div className="text-[10px] tracking-widests uppercase text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-medium tracking-wide text-foreground">Profile Verifications</h3>
              <Link href={adminRoutes.verifications} className="text-xs text-primary cursor-pointer">View all →</Link>
            </div>
            <div className="divide-y divide-border">
              {pending.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <div className="text-sm font-medium text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.age} · {p.city}, {p.country} · {p.submitted}</div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPending((pp) => pp.filter((x) => x.id !== p.id))} className="w-7 h-7 bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => setPending((pp) => pp.filter((x) => x.id !== p.id))} className="w-7 h-7 bg-rose-950 border border-rose-800/50 flex items-center justify-center text-rose-400 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-600" />All caught up
                </div>
              )}
            </div>
          </div>
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-medium tracking-wide text-foreground">Connection Requests</h3>
              <Link href={adminRoutes.connectionRequests} className="text-xs text-primary cursor-pointer">View all →</Link>
            </div>
            <div className="divide-y divide-border">
              {pendingConnCount === 0 ? (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-600" />All caught up
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  {pendingConnCount} pending request{pendingConnCount === 1 ? "" : "s"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
