import { auth } from "@/auth";
import type { UserRole } from "@/lib/types";

export async function getServerSession() {
  return auth();
}

export async function getServerUserRole(): Promise<UserRole> {
  const session = await auth();
  return session?.user?.role ?? "guest";
}

export async function requireRole(allowed: Exclude<UserRole, "guest">[]) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || !role || !allowed.includes(role)) {
    return null;
  }
  return session;
}
