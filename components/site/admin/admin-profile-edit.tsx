"use client";

import { useState } from "react";
import { Check, ChevronLeft, ToggleLeft, ToggleRight, Upload, CheckCircle2 } from "lucide-react";
import type { Profile } from "@/lib/types";
import { ghostBtn, goldBtn, inp, lbl } from "@/lib/ui-styles";

export function AdminProfileEdit({ profile, isNew, onBack, onSave }: { profile: Profile | null; isNew: boolean; onBack: () => void; onSave: (p: Partial<Profile>) => void }) {
  const [form, setForm] = useState<Partial<Profile>>(profile ?? { name: "", age: 25, country: "", city: "", languages: [], verification: "Verified", rate: 300, available: true, featured: false, suspended: false, bio: "", tags: [], travel: [] });
  const [saved, setSaved] = useState(false);

  function set(field: string, value: unknown) { setForm((p) => ({ ...p, [field]: value })); }
  function handleSave() { onSave(form); setSaved(true); setTimeout(() => { setSaved(false); if (isNew) onBack(); }, 2000); }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-6"><ChevronLeft className="w-3.5 h-3.5" /> Back to Profiles</button>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal text-foreground">{isNew ? "Add New Profile" : `Edit: ${profile?.name}`}</h2>
        {saved && <div className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" />{isNew ? "Created." : "Saved."}</div>}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border border-border bg-card p-6">
          <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-4">Photo</h3>
          {profile ? <div className="aspect-square overflow-hidden bg-secondary border border-border mb-3"><img src={`https://images.unsplash.com/photo-${profile.photoId}?w=300&h=300&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" /></div>
            : <div className="aspect-square border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground mb-3 cursor-pointer hover:border-primary hover:text-primary transition-colors"><Upload className="w-8 h-8" /><span className="text-xs">Upload photo</span></div>}
          <button className={`${ghostBtn("sm")} w-full justify-center`}><Upload className="w-3.5 h-3.5" /> {profile ? "Change" : "Upload"}</button>
          <div className="mt-5 space-y-2 border-t border-border pt-4">
            <h3 className="text-xs font-semibold tracking-widests uppercase text-muted-foreground mb-3">Verification</h3>
            {(["Verified", "Premium Verified", "VIP Verified"] as const).map((v) => <label key={v} className="flex items-center gap-2.5 cursor-pointer"><div onClick={() => set("verification", v)} className={`w-4 h-4 border flex items-center justify-center transition-colors ${form.verification === v ? "bg-primary border-primary" : "border-border"}`}>{form.verification === v && <Check className="w-2.5 h-2.5 text-primary-foreground" />}</div><span className="text-xs text-foreground">{v}</span></label>)}
          </div>
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            {[["Available", "available"], ["Featured", "featured"], ["Suspended", "suspended"]].map(([label, field]) => (
              <div key={field} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <button onClick={() => set(field, !(form as Record<string, unknown>)[field])} className="cursor-pointer">
                  {(form as Record<string, unknown>)[field] ? <ToggleRight className={`w-6 h-6 ${field === "suspended" ? "text-rose-500" : "text-primary"}`} /> : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 space-y-5">
          <div className="border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-medium tracking-wide text-foreground">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4"><div><label className={lbl}>Full Name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} /></div><div><label className={lbl}>Age</label><input type="number" value={form.age} onChange={(e) => set("age", Number(e.target.value))} className={inp} min={18} max={60} /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className={lbl}>City</label><input value={form.city} onChange={(e) => set("city", e.target.value)} className={inp} /></div><div><label className={lbl}>Country</label><input value={form.country} onChange={(e) => set("country", e.target.value)} className={inp} /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className={lbl}>Height</label><input value={form.height ?? ""} onChange={(e) => set("height", e.target.value)} className={inp} /></div><div><label className={lbl}>Nationality</label><input value={form.nationality ?? ""} onChange={(e) => set("nationality", e.target.value)} className={inp} /></div></div>
            <div><label className={lbl}>Introduction Rate ($)</label><input type="number" value={form.rate} onChange={(e) => set("rate", Number(e.target.value))} className={inp} min={100} step={50} /></div>
          </div>
          <div className="border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-medium tracking-wide text-foreground">Profile Content</h3>
            <div><label className={lbl}>Bio</label><textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={5} className={`${inp} resize-none`} /></div>
            <div><label className={lbl}>Education</label><input value={form.education ?? ""} onChange={(e) => set("education", e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Languages (comma-separated)</label><input value={(form.languages ?? []).join(", ")} onChange={(e) => set("languages", e.target.value.split(",").map(l => l.trim()).filter(Boolean))} className={inp} /></div>
            <div><label className={lbl}>Tags (comma-separated)</label><input value={(form.tags ?? []).join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} className={inp} /></div>
            <div><label className={lbl}>Travel Regions</label><input value={(form.travel ?? []).join(", ")} onChange={(e) => set("travel", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} className={inp} /></div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onBack} className={ghostBtn("md")}>Cancel</button>
            <button onClick={handleSave} className={goldBtn("md")}>{isNew ? "Create Profile" : "Save Changes"} <Check className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

