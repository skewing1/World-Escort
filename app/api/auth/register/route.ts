import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { planEnumFromLabel } from "@/lib/db/mappers";
import { getPlanConfig } from "@/lib/db/plans";

function mapRole(role: string): UserRole | null {
  const map: Record<string, UserRole> = {
    male: "MALE",
    female: "FEMALE",
    admin: "ADMIN",
  };
  return map[role.toLowerCase()] ?? null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, plan, firstName, lastName } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 });
    }

    const userRole = mapRole(role);
    if (!userRole || userRole === "ADMIN") {
      return NextResponse.json({ error: "Invalid registration role" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    let membershipData;
    if (userRole === "MALE") {
      const membershipPlan = planEnumFromLabel(plan ?? "Premium") ?? "PREMIUM";
      const planConfig = await getPlanConfig(membershipPlan);

      if (!planConfig) {
        return NextResponse.json({ error: "Invalid membership plan" }, { status: 400 });
      }

      membershipData = {
        create: {
          plan: membershipPlan,
          requestsLimit: planConfig.requestsLimit,
          currentPeriodEnd: periodEnd,
        },
      };
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: userRole,
        firstName,
        lastName,
        membership: membershipData,
      },
      include: { membership: true },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role.toLowerCase(),
          membership: user.membership,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/auth/register failed:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
