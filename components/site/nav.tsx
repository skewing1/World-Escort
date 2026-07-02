"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Crown, LogOut, Settings, X } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { goldBtn } from "@/lib/ui-styles";
import { routes } from "@/lib/routes";

const navLinks = [
  { label: "Browse", href: routes.browse },
  { label: "Membership", href: routes.membership },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

export function Nav() {
  const pathname = usePathname();
  const { userRole, openModal, logout } = useApp();
  const [mob, setMob] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-xl" style={{ background: "rgba(7,5,13,0.92)" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href={routes.home} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 border border-primary/60 flex items-center justify-center">
            <Crown className="w-4 h-4 text-primary" />
          </div>
          <span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-lg font-semibold tracking-[0.2em] uppercase">
            Aurum
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer ${isActive(href) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {userRole === "guest" ? (
            <>
              <button onClick={() => openModal("login")} className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Sign In
              </button>
              <button onClick={() => openModal("register")} className={goldBtn("sm")}>
                Join Now
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              {userRole === "male" && (
                <Link href={routes.maleDashboard} className={`text-xs tracking-[0.18em] uppercase transition-colors cursor-pointer ${pathname.startsWith(routes.maleDashboard) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  Dashboard
                </Link>
              )}
              {userRole === "female" && (
                <Link href={routes.femaleDashboard} className={`text-xs tracking-[0.18em] uppercase transition-colors cursor-pointer ${pathname.startsWith(routes.femaleDashboard) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  Dashboard
                </Link>
              )}
              {userRole === "admin" && (
                <Link href={routes.admin} className={`text-xs tracking-[0.18em] uppercase transition-colors cursor-pointer ${pathname.startsWith(routes.admin) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  Admin Portal
                </Link>
              )}
              <div className="flex items-center gap-2 border-l border-border pl-3 text-xs text-muted-foreground">
                <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="tracking-wide capitalize">{userRole}</span>
              </div>
              <button onClick={logout} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <button className="md:hidden text-muted-foreground cursor-pointer" onClick={() => setMob(!mob)}>
          {mob ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>
      </div>
      {mob && (
        <div className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setMob(false)} className="text-xs tracking-[0.2em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left">
              {label}
            </Link>
          ))}
          {userRole === "guest" && (
            <button
              onClick={() => {
                openModal("login");
                setMob(false);
              }}
              className={goldBtn("sm")}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
}
