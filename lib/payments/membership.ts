import type { BillingCycle, MembershipPlan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPlanConfig } from "@/lib/db/plans";
import { planEnumFromLabel, planLabelFromEnum } from "@/lib/db/mappers";

export function computeMembershipAmountCents(
  monthlyPriceCents: number,
  annualPriceCents: number,
  billingCycle: BillingCycle,
): number {
  if (billingCycle === "ANNUAL") {
    return annualPriceCents * 12;
  }
  return monthlyPriceCents;
}

export function computeMonthlyDisplayCents(
  monthlyPriceCents: number,
  annualPriceCents: number,
  billingCycle: BillingCycle,
): number {
  return billingCycle === "ANNUAL" ? annualPriceCents : monthlyPriceCents;
}

export async function resolvePlanPricing(planLabel: string, billingCycle: BillingCycle) {
  const plan = planEnumFromLabel(planLabel);
  if (!plan) {
    throw new Error("Invalid plan");
  }

  const config = await getPlanConfig(plan);
  if (!config) {
    throw new Error("Plan configuration not found");
  }

  const amountCents = computeMembershipAmountCents(
    config.monthlyPriceCents,
    config.annualPriceCents,
    billingCycle,
  );

  return {
    plan,
    planLabel: planLabelFromEnum(plan),
    billingCycle,
    amountCents,
    monthlyPriceCents: config.monthlyPriceCents,
    annualPriceCents: config.annualPriceCents,
    requestsLimit: config.requestsLimit,
  };
}

export function parseBillingCycle(value: string): BillingCycle {
  return value.toLowerCase() === "annual" ? "ANNUAL" : "MONTHLY";
}

export async function activateMembershipForUser(
  userId: number,
  plan: MembershipPlan,
  billingCycle: BillingCycle,
  amountCents: number,
) {
  const config = await getPlanConfig(plan);
  if (!config) {
    throw new Error("Plan configuration not found");
  }

  const periodEnd = new Date();
  if (billingCycle === "ANNUAL") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  const description = `${planLabelFromEnum(plan)} Membership (${billingCycle === "ANNUAL" ? "Annual" : "Monthly"})`;

  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { role: "MALE" },
    });

    const membership = await tx.membership.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        billingCycle,
        status: "ACTIVE",
        requestsLimit: config.requestsLimit,
        requestsUsed: 0,
        totalSpendCents: amountCents,
        currentPeriodEnd: periodEnd,
      },
      update: {
        plan,
        billingCycle,
        status: "ACTIVE",
        requestsLimit: config.requestsLimit,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
        totalSpendCents: { increment: amountCents },
      },
    });

    await tx.billingRecord.create({
      data: {
        membershipId: membership.id,
        description,
        amountCents,
        status: "PAID",
      },
    });

    return membership;
  });
}
