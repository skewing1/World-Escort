import { toContactMessageDto } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";
import type { ContactMessage } from "@/lib/types";

export async function listContactMessages(): Promise<ContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toContactMessageDto);
}
