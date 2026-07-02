import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/types";

declare module "next-auth" {
  interface User {
    role: Exclude<UserRole, "guest">;
    membershipPlan?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Exclude<UserRole, "guest">;
      membershipPlan: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Exclude<UserRole, "guest">;
    membershipPlan: string | null;
  }
}

export {};
