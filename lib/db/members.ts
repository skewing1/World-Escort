import { prisma } from "@/lib/prisma";
import { toMemberDto, toMemberRequestDto } from "@/lib/db/mappers";
import type { Member } from "@/lib/types";

export async function listMembers(): Promise<Member[]> {
  const rows = await prisma.user.findMany({
    where: { role: "MALE" },
    include: { membership: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(toMemberDto);
}

export async function getMemberById(id: number): Promise<Member | null> {
  const row = await prisma.user.findFirst({
    where: { id, role: "MALE" },
    include: { membership: true },
  });

  return row ? toMemberDto(row) : null;
}

export async function getMemberRequests(memberId: number) {
  const rows = await prisma.connectionRequest.findMany({
    where: { memberId },
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(toMemberRequestDto);
}

export async function toggleMemberStatus(id: number): Promise<Member | null> {
  const user = await prisma.user.findFirst({
    where: { id, role: "MALE" },
  });

  if (!user) return null;

  const updated = await prisma.user.update({
    where: { id },
    data: { status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" },
    include: { membership: true },
  });

  return toMemberDto(updated);
}
