import { NextResponse } from "next/server";
import { getSessionUserId, requireApiRole } from "@/lib/api/auth";
import { getPaymentByStripeSessionId } from "@/lib/db/payments";
import { fulfillStripeSession } from "@/lib/payments/fulfill";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function GET(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
    }

    const auth = await requireApiRole(["male", "female", "admin"]);
    if (auth.error) return auth.error;

    const userId = getSessionUserId(auth.session!);
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const payment = await getPaymentByStripeSessionId(sessionId);
    if (!payment || payment.userId !== userId) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json({ status: "completed", payment });
    }

    const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status === "paid" || stripeSession.status === "complete") {
      const fulfilled = await fulfillStripeSession(
        sessionId,
        typeof stripeSession.payment_intent === "string" ? stripeSession.payment_intent : stripeSession.payment_intent?.id,
      );
      return NextResponse.json({ status: "completed", payment: fulfilled });
    }

    return NextResponse.json({
      status: payment.status.toLowerCase(),
      payment,
      stripeStatus: stripeSession.status,
    });
  } catch (error) {
    console.error("GET /api/payments/stripe/session failed:", error);
    return NextResponse.json({ error: "Failed to verify payment session" }, { status: 500 });
  }
}
