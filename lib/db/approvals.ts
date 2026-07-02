import { prisma } from "@/lib/prisma";
import { toPendingApprovalDto } from "@/lib/db/mappers";
import type { PendingApproval } from "@/lib/types";

export async function listPendingApprovals(): Promise<PendingApproval[]> {
  const rows = await prisma.profileApproval.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toPendingApprovalDto);
}

export async function removeApproval(id: number): Promise<boolean> {
  try {
    await prisma.profileApproval.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
