"use client";

import { MessageCircle } from "lucide-react";
import { AdminConnectionRequests } from "@/components/site/admin/admin-connection-requests";
import { AdminContacts } from "@/components/site/admin/admin-contacts";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";

export function AdminConnectionRequestsPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Connection Requests" />
      <div className="p-6 space-y-4">
        <h2 className="text-xs font-medium tracking-widests uppercase text-muted-foreground flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          Member Connection Requests
        </h2>
        <AdminConnectionRequests />
      </div>
    </>
  );
}

export function AdminContactsPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Contact Messages" />
      <div className="p-6 space-y-4">
        <h2 className="text-xs font-medium tracking-widests uppercase text-muted-foreground flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          Contact Form Submissions
        </h2>
        <AdminContacts />
      </div>
    </>
  );
}
