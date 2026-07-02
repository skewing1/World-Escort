import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-server";
import type { UserRole } from "@/lib/types";

type AllowedRole = Exclude<UserRole, "guest">;

export async function requireApiRole(allowed: AllowedRole[]) {
  const session = await requireRole(allowed);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export function getSessionUserId(session: { user?: { id?: string } | null }): number | null {
  const id = session.user?.id;
  if (!id) return null;
  const parsed = Number(id);
  return Number.isNaN(parsed) ? null : parsed;
}
