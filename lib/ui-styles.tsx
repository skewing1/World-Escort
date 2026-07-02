import type { ReactNode } from "react";
import { Crown, Shield, Star } from "lucide-react";

export const verBadge: Record<string, string> = {
  Verified: "bg-emerald-950/80 text-emerald-300 border-emerald-700/40",
  "Premium Verified": "bg-amber-950/80 text-amber-300 border-amber-700/40",
  "VIP Verified": "bg-purple-950/80 text-purple-300 border-purple-700/40",
};

export const verIcon: Record<string, ReactNode> = {
  Verified: <Shield className="w-2.5 h-2.5" />,
  "Premium Verified": <Star className="w-2.5 h-2.5" />,
  "VIP Verified": <Crown className="w-2.5 h-2.5" />,
};

export const statusBadge: Record<string, string> = {
  pending: "bg-amber-950 text-amber-400 border-amber-800/40",
  approved: "bg-emerald-950 text-emerald-400 border-emerald-800/40",
  rejected: "bg-rose-950 text-rose-400 border-rose-800/40",
  Active: "bg-emerald-950 text-emerald-400 border-emerald-800/40",
  Suspended: "bg-rose-950 text-rose-400 border-rose-800/40",
  Paid: "bg-emerald-950 text-emerald-400 border-emerald-800/40",
  Refunded: "bg-amber-950 text-amber-400 border-amber-800/40",
};

export const planColor: Record<string, string> = {
  Bronze: "text-amber-600",
  Premium: "text-primary",
  Elite: "text-purple-300",
};

export const planBorder: Record<string, string> = {
  Bronze: "border-amber-800/40",
  Premium: "border-primary/60",
  Elite: "border-purple-600/50",
};

export function goldBtn(size: "sm" | "md" | "lg" = "md") {
  const s = { sm: "px-4 py-2 text-xs", md: "px-6 py-3 text-xs", lg: "px-8 py-4 text-sm" };
  return `inline-flex items-center gap-2 ${s[size]} bg-primary text-primary-foreground font-semibold tracking-widest uppercase transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(196,146,42,0.35)] cursor-pointer`;
}

export function ghostBtn(size: "sm" | "md" | "lg" = "md") {
  const s = { sm: "px-4 py-2 text-xs", md: "px-6 py-3 text-xs", lg: "px-8 py-4 text-sm" };
  return `inline-flex items-center gap-2 ${s[size]} border border-border text-foreground font-semibold tracking-widest uppercase transition-all duration-300 hover:border-primary hover:text-primary cursor-pointer`;
}

export const inp =
  "w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors";

export const lbl = "block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2";

export function SLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px w-8 bg-primary/60" />
      <span className="text-[10px] tracking-[0.35em] uppercase text-primary">{text}</span>
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <div
      className="relative py-20 px-6 border-b border-border text-center"
      style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(196,146,42,0.1) 0%, transparent 60%), #0A0813" }}
    >
      <div className="max-w-3xl mx-auto">
        <SLabel text={eyebrow} />
        <h1 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-4xl md:text-5xl font-normal text-foreground mb-4">
          {title}
        </h1>
        {sub && <p className="text-muted-foreground font-light leading-relaxed">{sub}</p>}
      </div>
    </div>
  );
}
