import { prisma } from "@/lib/prisma";
import { parseRequestStatus, toConnectionRequestDto } from "@/lib/db/mappers";
import type { ConnectionRequest } from "@/lib/types";

export interface ConnectionRequestFilters {
  status?: string | null;
  memberId?: number;
}

export async function listConnectionRequests(
  filters: ConnectionRequestFilters = {},
): Promise<ConnectionRequest[]> {
  const status = filters.status ? parseRequestStatus(filters.status) : undefined;

  const rows = await prisma.connectionRequest.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(filters.memberId ? { memberId: filters.memberId } : {}),
    },
    include: { member: true, profile: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(toConnectionRequestDto);
}

export async function updateConnectionRequestStatus(
  id: number,
  status: string,
): Promise<ConnectionRequest | null> {
  const parsed = parseRequestStatus(status);
  if (!parsed) return null;

  try {
    const row = await prisma.connectionRequest.update({
      where: { id },
      data: { status: parsed },
      include: { member: true, profile: true },
    });
    return toConnectionRequestDto(row);
  } catch {
    return null;
  }
}

export async function createConnectionRequest(data: {
  memberId: number;
  profileId: number;
  message: string;
}): Promise<ConnectionRequest | null> {
  try {
    const row = await prisma.connectionRequest.create({
      data: {
        memberId: data.memberId,
        profileId: data.profileId,
        message: data.message,
      },
      include: { member: true, profile: true },
    });
    return toConnectionRequestDto(row);
  } catch {
    return null;
  }
}
