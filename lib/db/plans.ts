import type { MembershipPlan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { planEnumFromLabel, toPlanDto, type PlanDto } from "@/lib/db/mappers";

export async function listPlans(): Promise<PlanDto[]> {
  const rows = await prisma.planConfig.findMany({
    orderBy: { monthlyPriceCents: "asc" },
  });
  return rows.map(toPlanDto);
}

export async function getPlanByName(label: string) {
  const plan = planEnumFromLabel(label);
  if (!plan) return null;

  const row = await prisma.planConfig.findUnique({ where: { name: plan } });
  return row ? toPlanDto(row) : null;
}

export async function getPlanConfig(plan: MembershipPlan) {
  return prisma.planConfig.findUnique({ where: { name: plan } });
}

export async function requestsLimitForPlanLabel(label: string): Promise<number> {
  const config = await getPlanByName(label);
  if (!config) return 20;
  return config.requests === "Unlimited" ? -1 : config.requests;
}
