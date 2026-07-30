import { notFound } from "next/navigation";
import { AdminProfileEditPage } from "@/components/site/admin/pages/admin-profile-edit-page";
import { getProfileById } from "@/lib/db/profiles";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileId = Number(id);

  if (Number.isNaN(profileId)) {
    notFound();
  }

  const profile = await getProfileById(profileId);
  if (!profile) {
    notFound();
  }

  return <AdminProfileEditPage profile={profile} isNew={false} />;
}
