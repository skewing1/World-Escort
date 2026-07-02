import { NextResponse } from "next/server";
import { getSessionUserId, requireApiRole } from "@/lib/api/auth";
import { createPayment } from "@/lib/db/payments";
import { parseBillingCycle, resolvePlanPricing } from "@/lib/payments/membership";
import { appBaseUrl, getStripe, isStripeConfigured } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/payments/fulfill";
import { planLabelFromEnum } from "@/lib/db/mappers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
    }

    const auth = await requireApiRole(["male", "female", "admin"]);
    if (auth.error) return auth.error;

    const userId = getSessionUserId(auth.session!);
    const email = auth.session!.user?.email;
    if (!userId || !email) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, billing } = body;

    if (!plan) {
      return NextResponse.json({ error: "plan is required" }, { status: 400 });
    }

    const billingCycle = parseBillingCycle(billing ?? "monthly");
    const pricing = await resolvePlanPricing(plan, billingCycle);
    const customerId = await getOrCreateStripeCustomer(userId, email);
    const planLabel = planLabelFromEnum(pricing.plan);
    const interval = billingCycle === "ANNUAL" ? "year" : "month";
    const unitAmount =
      billingCycle === "ANNUAL" ? pricing.annualPriceCents : pricing.monthlyPriceCents;

    const payment = await createPayment({
      userId,
      plan: pricing.plan,
      billingCycle: pricing.billingCycle,
      amountCents: pricing.amountCents,
      method: "STRIPE",
    });

    const stripe = getStripe();
    const baseUrl = appBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Aurum ${planLabel} Membership`,
              description: `${planLabel} plan with ${pricing.requestsLimit === -1 ? "unlimited" : pricing.requestsLimit} connection requests per month`,
            },
            unit_amount: unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/purchase?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/purchase?cancelled=1&plan=${encodeURIComponent(planLabel)}`,
      metadata: {
        userId: String(userId),
        paymentId: String(payment.id),
        plan: pricing.plan,
        billingCycle: pricing.billingCycle,
      },
      subscription_data: {
        metadata: {
          userId: String(userId),
          paymentId: String(payment.id),
          plan: pricing.plan,
          billingCycle: pricing.billingCycle,
        },
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("POST /api/payments/stripe/checkout failed:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
