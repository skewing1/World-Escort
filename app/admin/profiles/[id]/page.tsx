import { notFound } from "next/navigation";
import { AdminProfileViewPage } from "@/components/site/admin/pages/admin-profile-view-page";
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

  return <AdminProfileViewPage profile={profile} />;
}
