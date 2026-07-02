"use client";

import { Ban, CheckCircle2, ChevronLeft, Crown, Mail } from "lucide-react";
import type { Member } from "@/lib/types";
import { MEMBER_REQUESTS, PLAN_LIMITS } from "@/lib/mock-data";
import { lbl, planColor, statusBadge } from "@/lib/ui-styles";

export function AdminMemberView({ member, onBack, onToggleSuspend }: { member: Member; onBack: () => void; onToggleSuspend: () => void }) {
  const requests = MEMBER_REQUESTS[member.id] ?? [];
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-6"><ChevronLeft className="w-3.5 h-3.5" /> Back to Members</button>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border border-border bg-card p-6 space-y-5">
          <div className="flex items-start justify-between"><div className="w-14 h-14 bg-secondary border border-primary/30 flex items-center justify-center"><Crown className="w-6 h-6 text-primary/60" /></div><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[member.status]}`}>{member.status}</span></div>
          <div><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal text-foreground">{member.name}</h2><div className="text-xs text-muted-foreground mt-1">{member.email}</div></div>
          <div className="space-y-3 border-t border-border pt-4">
            {[["Plan", member.plan], ["Country", member.country], ["Joined", member.joined], ["Total Spend", member.spend], ["Requests Made", String(member.requests)]].map(([k, v]) => <div key={k} className="flex justify-between text-xs"><span className="text-muted-foreground">{k}</span><span className={`font-medium ${k === "Plan" ? planColor[member.plan] : "text-foreground"}`}>{v}</span></div>)}
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <button onClick={onToggleSuspend} className={`w-full py-2.5 text-xs tracking-widests uppercase border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${member.status === "Active" ? "border-rose-800/50 text-rose-400 hover:bg-rose-950" : "border-emerald-700/50 text-emerald-400 hover:bg-emerald-950"}`}>
              {member.status === "Active" ? <><Ban className="w-3.5 h-3.5" />Suspend Member</> : <><CheckCircle2 className="w-3.5 h-3.5" />Reactivate</>}
            </button>
            <button className="w-full py-2.5 text-xs tracking-widests uppercase border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1.5"><Mail className="w-3.5 h-3.5" />Send Notification</button>
          </div>
        </div>
        <div className="md:col-span-2 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "Total Spend", value: member.spend }, { label: "Requests Made", value: String(member.requests) }, { label: "Approved", value: String(requests.filter(r => r.status === "approved").length) }].map(({ label, value }) => <div key={label} className="border border-border bg-card p-4 text-center"><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-medium text-foreground mb-0.5">{value}</div><div className="text-[10px] tracking-widests uppercase text-muted-foreground">{label}</div></div>)}
          </div>
          <div className="border border-border bg-card p-5">
            <h3 className="text-sm font-medium tracking-wide text-foreground mb-4">Membership Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><div className={lbl}>Current Plan</div><div className={`text-lg font-bold ${planColor[member.plan]}`}>{member.plan}</div><div className="text-xs text-muted-foreground">${member.plan === "Elite" ? "299" : member.plan === "Premium" ? "149" : "49"}/month</div></div>
              <div><div className={lbl}>Request Allowance</div><div className="text-lg font-semibold text-foreground">{String(PLAN_LIMITS[member.plan])}/month</div></div>
            </div>
            <div><div className={lbl}>Change Plan</div><div className="flex gap-2">{["Bronze", "Premium", "Elite"].map((p) => <button key={p} className={`px-4 py-2 text-xs tracking-widests uppercase border transition-colors cursor-pointer ${p === member.plan ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>{p}</button>)}</div></div>
          </div>
          <div className="border border-border bg-card">
            <div className="px-5 py-4 border-b border-border"><h3 className="text-sm font-medium tracking-wide text-foreground">Request History</h3></div>
            {requests.length === 0 ? <div className="px-5 py-8 text-center text-muted-foreground text-sm">No requests made yet.</div>
              : <table className="w-full"><thead><tr className="border-b border-border">{["Profile", "Date", "Status"].map((h) => <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{requests.map((r, i) => <tr key={i} className="hover:bg-secondary/30"><td className="px-5 py-3 text-sm text-foreground font-medium">{r.profile}</td><td className="px-5 py-3 text-xs text-muted-foreground">{r.date}</td><td className="px-5 py-3"><span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[r.status]}`}>{r.status}</span></td></tr>)}</tbody></table>}
          </div>
        </div>
      </div>
    </div>
  );
}

