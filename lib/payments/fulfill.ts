import { completePayment, getPaymentById, getPaymentByStripeSessionId } from "@/lib/db/payments";
import { activateMembershipForUser } from "@/lib/payments/membership";
import { prisma } from "@/lib/prisma";

export async function fulfillPayment(paymentId: number, extra?: { stripePaymentIntentId?: string; cryptoTxHash?: string }) {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "COMPLETED") {
    return payment;
  }

  await activateMembershipForUser(
    payment.userId,
    payment.plan,
    payment.billingCycle,
    payment.amountCents,
  );

  return completePayment(payment.id, extra);
}

export async function fulfillStripeSession(sessionId: string, paymentIntentId?: string | null) {
  const payment = await getPaymentByStripeSessionId(sessionId);
  if (!payment) {
    throw new Error("Payment not found for Stripe session");
  }

  return fulfillPayment(payment.id, {
    stripePaymentIntentId: paymentIntentId ?? undefined,
  });
}

export async function getOrCreateStripeCustomer(userId: number, email: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const { getStripe } = await import("@/lib/stripe");
  const customer = await getStripe().customers.create({
    email,
    metadata: { userId: String(userId) },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
