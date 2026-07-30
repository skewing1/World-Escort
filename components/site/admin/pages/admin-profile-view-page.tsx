"use client";

import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import { AdminProfileView } from "@/components/site/admin/admin-profile-view";
import type { Profile } from "@/lib/types";

export function AdminProfileViewPage({ profile }: { profile: Profile }) {
  return (
    <>
      <AdminPageHeader eyebrow="Administration · Profiles" title={profile.name} />
      <div className="p-6">
        <AdminProfileView profile={profile} />
      </div>
    </>
  );
}
