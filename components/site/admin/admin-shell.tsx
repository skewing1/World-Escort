"use client";

import { AdminSidebar } from "@/components/site/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16 min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
