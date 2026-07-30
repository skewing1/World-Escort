"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import { adminRoutes } from "@/lib/admin-routes";
import { MEMBERS_INIT } from "@/lib/mock-data";
import { inp, planColor, statusBadge } from "@/lib/ui-styles";

export function AdminMembersPage() {
  const [members, setMembers] = useState(MEMBERS_INIT);

  function toggleMemberSuspend(id: number) {
    setMembers((m) =>
      m.map((x) =>
        x.id === id ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" } : x,
      ),
    );
  }

  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Members" />
      <div className="p-6 space-y-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input placeholder="Search members…" className={`${inp} pl-9 py-2.5`} />
        </div>
        <div className="border border-border bg-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Member", "Country", "Plan", "Requests", "Total Spend", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{m.country}</td>
                  <td className="px-5 py-4"><span className={`text-xs font-medium ${planColor[m.plan]}`}>{m.plan}</span></td>
                  <td className="px-5 py-4 text-xs text-foreground">{m.requests}</td>
                  <td className="px-5 py-4 text-sm text-foreground font-semibold">{m.spend}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{m.joined}</td>
                  <td className="px-5 py-4"><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[m.status]}`}>{m.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 text-[10px] uppercase">
                      <Link href={adminRoutes.member(m.id)} className="text-primary hover:brightness-110 cursor-pointer">View</Link>
                      <span className="text-border">|</span>
                      <button type="button" onClick={() => toggleMemberSuspend(m.id)} className={`cursor-pointer ${m.status === "Active" ? "text-rose-500 hover:text-rose-400" : "text-emerald-500 hover:text-emerald-400"}`}>
                        {m.status === "Active" ? "Suspend" : "Activate"}
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
