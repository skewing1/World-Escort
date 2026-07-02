import type { UserRole as PrismaUserRole } from "@prisma/client";
import type { UserRole } from "@/lib/types";

export function prismaRoleToAppRole(role: PrismaUserRole): Exclude<UserRole, "guest"> {
  const map: Record<PrismaUserRole, Exclude<UserRole, "guest">> = {
    MALE: "male",
    FEMALE: "female",
    ADMIN: "admin",
  };
  return map[role];
}

export function dashboardPathForRole(role: Exclude<UserRole, "guest">): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "female":
      return "/dashboard/female";
    case "male":
      return "/dashboard/male";
  }
}
