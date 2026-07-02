import { notFound } from "next/navigation";
import { ProfileDetailPage } from "@/components/site/pages";
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

  return <ProfileDetailPage profile={profile} />;
}
