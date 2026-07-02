"use client";

import Link from "next/link";
import { Shield, Crown, UserCheck, ArrowRight } from "lucide-react";
import { PageHeader, SLabel, goldBtn, ghostBtn } from "@/lib/ui-styles";
import { SiteFooter } from "@/components/site/site-footer";
import { routes } from "@/lib/routes";

export function AboutPage() {
  return (
    <div className="pt-16 min-h-screen">
      <PageHeader eyebrow="Our Story" title={<>Founded on <em className="italic text-primary">Discretion</em></>} sub="Aurum was built on a singular belief: that meaningful introductions deserve a private, curated, and secure environment." />
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div><SLabel text="Mission" /><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground mb-6">Redefining the Premium Introduction</h2><p className="text-muted-foreground leading-relaxed font-light mb-5">Aurum was founded in 2019 by a team of privacy advocates and luxury industry veterans who recognized a gap in the market: a platform treating introductions with the same gravitas as a private members club.</p><p className="text-muted-foreground leading-relaxed font-light">We reject the transactional nature of conventional dating platforms. Every profile is human-verified. Every introduction is administrator-approved. Female members join free. Gentleman members access via subscription — with requests included, no extra fees.</p></div>
          <div className="grid grid-cols-2 gap-3">{["1529626455594-4ff0802cfb7e", "1524504388940-b1c1722653e0", "1488426862026-3ee34a7d66df", "1531746020798-e6953c6e8e04"].map((id, i) => <div key={i} className={`overflow-hidden bg-secondary border border-border ${i === 1 ? "mt-6" : ""}`}><img src={`https://images.unsplash.com/photo-${id}?w=280&h=360&fit=crop&auto=format&q=75`} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" /></div>)}</div>
        </div>
      </section>
      <section className="py-20 border-t border-b border-border" style={{ background: "#0A0813" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14"><SLabel text="Core Values" /><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground">What We Stand For</h2></div>
          <div className="grid md:grid-cols-3 gap-6">{[{ icon: Shield, title: "Absolute Discretion", desc: "Member identities, activity, and communications are encrypted and never shared with third parties. We are GDPR compliant and take a zero-tolerance approach to data breaches." }, { icon: UserCheck, title: "Human Verification", desc: "Every female profile is manually reviewed by our team. Government ID, live selfie verification, and consent documentation are required before any profile goes live." }, { icon: Crown, title: "Curated Excellence", desc: "We do not accept every applicant. Our standards ensure that Aurum remains a venue of genuine quality and mutual respect — for both female members and gentleman members." }].map(({ icon: Icon, title, desc }) => <div key={title} className="border border-border p-8 hover:border-primary/30 transition-colors"><div className="w-10 h-10 border border-primary/40 flex items-center justify-center mb-5"><Icon className="w-5 h-5 text-primary" /></div><h3 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-xl font-normal text-foreground mb-3">{title}</h3><p className="text-muted-foreground text-sm leading-relaxed font-light">{desc}</p></div>)}</div>
        </div>
      </section>
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14"><SLabel text="By the Numbers" /><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground">Aurum in Numbers</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[{ num: "2019", label: "Year Founded" }, { num: "68", label: "Countries Served" }, { num: "12,000+", label: "Active Members" }, { num: "2,400+", label: "Verified Profiles" }].map(({ num, label }) => <div key={label} className="border border-border p-6 text-center hover:border-primary/30 transition-colors"><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-4xl font-medium text-primary mb-2">{num}</div><div className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">{label}</div></div>)}</div>
      </section>
      <section className="py-20 border-t border-border" style={{ background: "#0A0813" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14"><SLabel text="Leadership" /><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground">Our Team</h2><p className="text-muted-foreground text-sm mt-3 font-light">Our leadership operates under privacy protocols in keeping with our members' expectations.</p></div>
          <div className="grid md:grid-cols-4 gap-5">{[{ role: "Founder & CEO", initial: "A.V.", region: "Geneva, Switzerland" }, { role: "Head of Verification", initial: "S.K.", region: "London, United Kingdom" }, { role: "Head of Member Relations", initial: "M.D.", region: "Dubai, UAE" }, { role: "Chief Privacy Officer", initial: "R.H.", region: "Zurich, Switzerland" }].map(({ role, initial, region }) => <div key={role} className="border border-border bg-card p-6 text-center"><div className="w-16 h-16 bg-secondary border border-primary/20 flex items-center justify-center mx-auto mb-4"><span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-xl font-medium text-primary">{initial}</span></div><div className="text-sm font-medium text-foreground mb-1">{role}</div><div className="text-[10px] tracking-wide text-muted-foreground">{region}</div></div>)}</div>
        </div>
      </section>
      <section className="py-20 px-6 border-t border-border text-center" style={{ background: "linear-gradient(135deg, #0F0B18 0%, #1A0828 50%, #0F0B18 100%)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl font-normal text-foreground mb-4">Ready to Join?</h2>
          <p className="text-muted-foreground font-light mb-8">Whether you are a gentleman seeking exceptional introductions, or a woman wishing to create a verified profile — Aurum welcomes you.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4"><Link href={routes.membership} className={goldBtn("lg")}>View Membership Plans <ArrowRight className="w-4 h-4" /></Link><Link href={routes.contact} className={ghostBtn("lg")}>Contact Us</Link></div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

