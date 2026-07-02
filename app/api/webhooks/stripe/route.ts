import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { fulfillStripeSession } from "@/lib/payments/fulfill";
import { updatePaymentStatus } from "@/lib/db/payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.id) {
          await fulfillStripeSession(
            session.id,
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          );
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object;
        const { getPaymentByStripeSessionId } = await import("@/lib/db/payments");
        const payment = await getPaymentByStripeSessionId(session.id);
        if (payment && payment.status === "PENDING") {
          await updatePaymentStatus(payment.id, "CANCELLED");
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler failed:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
