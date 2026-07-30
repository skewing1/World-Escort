"use client";

import { useRouter } from "next/navigation";
import { AdminMemberView } from "@/components/site/admin/admin-member-view";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import { adminRoutes } from "@/lib/admin-routes";
import type { Member } from "@/lib/types";

export function AdminMemberDetailPage({ member }: { member: Member }) {
  const router = useRouter();

  return (
    <>
      <AdminPageHeader eyebrow="Administration · Members" title={member.name} />
      <div className="p-6">
        <AdminMemberView
          member={member}
          backHref={adminRoutes.members}
          onToggleSuspend={() => router.push(adminRoutes.members)}
        />
      </div>
    </>
  );
}
