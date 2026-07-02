"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ProfileCard } from "@/components/site/profile-card";
import { SiteFooter } from "@/components/site/site-footer";
import { PROFILES_INIT } from "@/lib/mock-data";
import { goldBtn, ghostBtn, SLabel } from "@/lib/ui-styles";
import { routes } from "@/lib/routes";

export function HomePage() {
  const router = useRouter();
  const featured = PROFILES_INIT.filter((p) => p.featured && !p.suspended);
  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "radial-gradient(ellipse at 20% 60%, rgba(123,28,62,0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(196,146,42,0.12) 0%, transparent 45%), #07050D" }}>
        <div className="absolute inset-0 pointer-events-none"><div className="absolute left-[15%] top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(196,146,42,0.15) 30%, rgba(196,146,42,0.15) 70%, transparent)" }} /><div className="absolute right-[15%] top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(196,146,42,0.1) 30%, rgba(196,146,42,0.1) 70%, transparent)" }} /></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-24">
          <div className="inline-flex items-center gap-3 mb-8"><div className="h-px w-12 bg-primary/60" /><span className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium">Private Members Platform</span><div className="h-px w-12 bg-primary/60" /></div>
          <h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-5xl md:text-7xl font-normal leading-[1.1] text-foreground mb-6">Where <em className="italic text-primary">Distinction</em><br />Meets Desire</h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-3 font-light tracking-wide">A curated marketplace connecting discerning gentlemen with exceptional, verified women from around the world.</p>
          <p className="text-sm text-muted-foreground/70 mb-10">Female profiles are <span className="text-primary">free to create</span>. Membership for gentlemen includes connection requests — no per-introduction fees.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4"><Link href={routes.membership} className={goldBtn("lg")}>Become a Member <ArrowRight className="w-4 h-4" /></Link><Link href={routes.browse} className={ghostBtn("lg")}>Browse Profiles</Link></div>
          <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border pt-12">{[{ num: "2,400+", label: "Verified Profiles" }, { num: "68", label: "Countries" }, { num: "12,000+", label: "Active Members" }].map(({ num, label }) => <div key={label} className="text-center"><div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl md:text-4xl font-medium text-primary mb-1">{num}</div><div className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">{label}</div></div>)}</div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"><div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</div><ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" /></div>
      </section>
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12"><div><SLabel text="Featured" /><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl md:text-4xl font-normal">Distinguished Members</h2></div>          <button onClick={() => router.push(routes.browse)} className="hidden sm:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer">View All <ArrowRight className="w-3.5 h-3.5" /></button></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{featured.slice(0, 5).map((p) => <ProfileCard key={p.id} profile={p} onClick={() => router.push(routes.profile(p.id))} />)}</div>
      </section>
      <section className="py-24 border-t border-b border-border" style={{ background: "#0A0813" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16"><SLabel text="How It Works" /><h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-3xl md:text-4xl font-normal">The Aurum Experience</h2></div>
          <div className="grid md:grid-cols-4 gap-0">{[{ step: "01", title: "Get a Membership", desc: "Choose Bronze, Premium, or Elite. Higher tiers unlock more monthly connection requests — all included in your plan." }, { step: "02", title: "Browse Profiles", desc: "Access verified profiles with photographs, bios, languages, and travel availability." }, { step: "03", title: "Send a Request", desc: "Use one of your monthly requests. Admin reviews every submission before proceeding." }, { step: "04", title: "Private Introduction", desc: "Upon approval by both parties, exclusive contact details are released." }].map(({ step, title, desc }, i) => <div key={step} className="relative border-t border-border pt-8 pb-8 md:pr-8">{i < 3 && <div className="hidden md:block absolute top-0 right-0 w-px h-full bg-border" />}<div style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-5xl font-medium text-primary/20 mb-6 leading-none">{step}</div><h3 className="text-sm font-semibold tracking-wide text-foreground mb-3">{title}</h3><p className="text-sm text-muted-foreground leading-relaxed font-light">{desc}</p></div>)}</div>
        </div>
      </section>
      <section className="py-24 border-t border-b border-border relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0B18 0%, #1A0828 50%, #0F0B18 100%)" }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #C4922A 0, #C4922A 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative text-center max-w-3xl mx-auto px-6">
          <h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-4xl md:text-5xl font-normal text-foreground mb-4">Membership Opens<br /><em className="italic text-primary">Doors</em></h2>
          <p className="text-muted-foreground mb-10 font-light">Female profiles are free to create. Membership is for gentleman members — connection requests are included in your plan with no additional fees.</p>
          <Link href={routes.membership} className={goldBtn("lg")}>View Membership Plans <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

