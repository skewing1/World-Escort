"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Crown,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Sliders,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { adminRoutes } from "@/lib/admin-routes";

const navItems = [
  { href: adminRoutes.overview, label: "Overview", icon: LayoutDashboard },
  { href: adminRoutes.members, label: "Members", icon: Users },
  { href: adminRoutes.profiles, label: "Profiles", icon: Star },
  { href: adminRoutes.verifications, label: "Profile Verifications", icon: UserCheck, badgeKey: "verifications" as const },
  { href: adminRoutes.connectionRequests, label: "Connection Requests", icon: MessageCircle, badgeKey: "connections" as const },
  { href: adminRoutes.contacts, label: "Contact Messages", icon: Mail },
  { href: adminRoutes.plans, label: "Plans & Settings", icon: Sliders },
  { href: adminRoutes.analytics, label: "Analytics", icon: BarChart3 },
];

function isActive(pathname: string, href: string) {
  if (href === adminRoutes.overview) {
    return pathname === adminRoutes.root || pathname === adminRoutes.overview;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [pendingConnCount, setPendingConnCount] = useState(0);
  const [pendingVerificationCount, setPendingVerificationCount] = useState(0);

  useEffect(() => {
    void fetch("/api/approvals")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.total != null) setPendingVerificationCount(data.total);
      })
      .catch(() => {});

    void fetch("/api/connection-requests?status=pending")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.total != null) setPendingConnCount(data.total);
      })
      .catch(() => {});
  }, [pathname]);

  function badgeFor(key?: "verifications" | "connections") {
    if (key === "verifications" && pendingVerificationCount > 0) return pendingVerificationCount;
    if (key === "connections" && pendingConnCount > 0) return pendingConnCount;
    return null;
  }

  return (
    <aside
      className="w-64 shrink-0 border-r border-border flex flex-col"
      style={{ background: "#0A0813" }}
    >
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-4 h-4 text-primary" />
          <span
            style={{ fontFamily: "'Bodoni Moda', serif" }}
            className="text-sm tracking-[0.2em] uppercase text-foreground"
          >
            Aurum
          </span>
        </div>
        <div className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
          Admin Portal
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badgeKey }) => {
          const active = isActive(pathname, href);
          const badge = badgeFor(badgeKey);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.12em] uppercase transition-colors ${
                active
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {badge != null && (
                <span className="min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-medium bg-primary/20 text-primary border border-primary/30">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
