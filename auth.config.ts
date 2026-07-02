import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/types";

export const authConfig = {
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const role = auth?.user?.role;

      const protectedRoutes: { prefix: string; role: Exclude<UserRole, "guest"> }[] = [
        { prefix: "/admin", role: "admin" },
        { prefix: "/dashboard/male", role: "male" },
        { prefix: "/dashboard/female", role: "female" },
      ];

      for (const route of protectedRoutes) {
        if (pathname.startsWith(route.prefix)) {
          return !!auth && role === route.role;
        }
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role as Exclude<UserRole, "guest">;
        token.membershipPlan = user.membershipPlan ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Exclude<UserRole, "guest">) ?? "male";
        session.user.membershipPlan = (token.membershipPlan as string | null) ?? null;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
