import { Crown } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <Crown className="w-4 h-4 text-primary" />
          <span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-base tracking-[0.2em] uppercase">
            Aurum
          </span>
        </div>
        <div className="text-[11px] tracking-widests text-muted-foreground uppercase">
          © 2025 Aurum International. Members 18+
        </div>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Compliance"].map((l) => (
            <span key={l} className="text-[11px] tracking-widests uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {l}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
