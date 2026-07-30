"use client";

import { AdminProfileEdit } from "@/components/site/admin/admin-profile-edit";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import { adminRoutes } from "@/lib/admin-routes";
import type { Profile } from "@/lib/types";

export function AdminProfileEditPage({
  profile,
  isNew,
}: {
  profile: Profile | null;
  isNew: boolean;
}) {
  function handleSave(_data: Partial<Profile>) {
    // TODO: wire to PATCH /api/profiles when admin list uses API
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Administration · Profiles"
        title={isNew ? "Add Profile" : `Edit ${profile?.name ?? "Profile"}`}
      />
      <div className="p-6">
        <AdminProfileEdit
          profile={profile}
          isNew={isNew}
          backHref={isNew || !profile ? adminRoutes.profiles : adminRoutes.profile(profile.id)}
          onSave={handleSave}
        />
      </div>
    </>
  );
}
