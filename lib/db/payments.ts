import type { BillingCycle, MembershipPlan, PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createPayment(data: {
  userId: number;
  plan: MembershipPlan;
  billingCycle: BillingCycle;
  amountCents: number;
  method: PaymentMethod;
  stripeSessionId?: string;
  cryptoSymbol?: string;
  cryptoAmount?: string;
  cryptoAddress?: string;
  cryptoTxHash?: string;
}) {
  return prisma.payment.create({
    data: {
      userId: data.userId,
      plan: data.plan,
      billingCycle: data.billingCycle,
      amountCents: data.amountCents,
      method: data.method,
      status: "PENDING",
      stripeSessionId: data.stripeSessionId,
      cryptoSymbol: data.cryptoSymbol,
      cryptoAmount: data.cryptoAmount,
      cryptoAddress: data.cryptoAddress,
      cryptoTxHash: data.cryptoTxHash,
    },
  });
}

export async function getPaymentByStripeSessionId(sessionId: string) {
  return prisma.payment.findUnique({ where: { stripeSessionId: sessionId } });
}

export async function getPaymentById(id: number) {
  return prisma.payment.findUnique({ where: { id } });
}

export async function updatePaymentStatus(
  id: number,
  status: PaymentStatus,
  extra?: {
    stripePaymentIntentId?: string;
    cryptoTxHash?: string;
    completedAt?: Date;
  },
) {
  return prisma.payment.update({
    where: { id },
    data: {
      status,
      ...(extra?.stripePaymentIntentId ? { stripePaymentIntentId: extra.stripePaymentIntentId } : {}),
      ...(extra?.cryptoTxHash ? { cryptoTxHash: extra.cryptoTxHash } : {}),
      ...(status === "COMPLETED" ? { completedAt: extra?.completedAt ?? new Date() } : {}),
    },
  });
}

export async function completePayment(paymentId: number, extra?: { stripePaymentIntentId?: string; cryptoTxHash?: string }) {
  return updatePaymentStatus(paymentId, "COMPLETED", {
    ...extra,
    completedAt: new Date(),
  });
}
