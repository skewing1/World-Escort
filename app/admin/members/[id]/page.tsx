import { notFound } from "next/navigation";
import { AdminMemberDetailPage } from "@/components/site/admin/pages/admin-member-detail-page";
import { MEMBERS_INIT } from "@/lib/mock-data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memberId = Number(id);

  if (Number.isNaN(memberId)) {
    notFound();
  }

  const member = MEMBERS_INIT.find((m) => m.id === memberId);
  if (!member) {
    notFound();
  }

  return <AdminMemberDetailPage member={member} />;
}
