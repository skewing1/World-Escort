"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { PageHeader, goldBtn, inp, lbl } from "@/lib/ui-styles";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", role: "gentleman", message: "" });
  const [sent, setSent] = useState(false);
  function set(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })); }
  return (
    <div className="pt-16 min-h-screen">
      <PageHeader eyebrow="Get In Touch" title="We Are Here For You" sub="Questions about membership, profile verification, or concierge assistance — our team responds within 24 hours." />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-4">{[{ icon: Mail, label: "General Enquiries", value: "hello@aurum-private.com", sub: "Response within 24 hours" }, { icon: Mail, label: "Membership Support", value: "members@aurum-private.com", sub: "Priority for active members" }, { icon: Phone, label: "Concierge Line", value: "+1 (800) 287-6612", sub: "Elite members · Mon–Fri 9am–6pm GMT" }, { icon: MapPin, label: "Registered Office", value: "71 Knightsbridge, London", sub: "SW1X 7SR, United Kingdom" }].map(({ icon: Icon, label, value, sub }) => <div key={label} className="flex items-start gap-4 p-4 border border-border hover:border-primary/30 transition-colors group"><div className="w-8 h-8 shrink-0 border border-border group-hover:border-primary/40 flex items-center justify-center transition-colors"><Icon className="w-3.5 h-3.5 text-primary" /></div><div><div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-0.5">{label}</div><div className="text-sm font-medium text-foreground">{value}</div><div className="text-xs text-muted-foreground mt-0.5 font-light">{sub}</div></div></div>)}</div>
          <div className="md:col-span-3">{sent ? <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-border bg-card"><CheckCircle2 className="w-12 h-12 text-primary mb-4" /><h3 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal text-foreground mb-2">Message Received</h3><p className="text-muted-foreground font-light text-sm">Our team will be in contact within 24 hours.</p><button onClick={() => setSent(false)} className="mt-8 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer">Send another message</button></div> : <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="border border-border bg-card p-8 space-y-5"><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-xl font-normal text-foreground">Send a Message</h2><div className="grid grid-cols-2 gap-4"><div><label className={lbl}>Full Name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp} /></div><div><label className={lbl}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required className={inp} /></div></div><div><label className={lbl}>I am a</label><div className="grid grid-cols-3 gap-2">{[{ v: "gentleman", l: "Gentleman Member" }, { v: "female", l: "Profile Member" }, { v: "prospect", l: "Prospective" }].map(({ v, l }) => <button type="button" key={v} onClick={() => set("role", v)} className={`py-2.5 text-xs border transition-colors cursor-pointer ${form.role === v ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{l}</button>)}</div></div><div><label className={lbl}>Subject</label><select value={form.subject} onChange={(e) => set("subject", e.target.value)} required className={inp}><option value="">Select…</option><option>Membership Enquiry</option><option>Profile Verification</option><option>Account Issue</option><option>Payment & Billing</option><option>Concierge Service</option><option>Privacy & Compliance</option><option>Other</option></select></div><div><label className={lbl}>Message</label><textarea value={form.message} onChange={(e) => set("message", e.target.value)} required rows={5} className={`${inp} resize-none`} /></div><button type="submit" className={`${goldBtn("md")} w-full justify-center`}>Send Message <Send className="w-4 h-4" /></button></form>}</div>
        </div>
      </div>
    </div>
  );
}

