import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 501 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const raw = await req.text();

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe/webhook] signature error", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as import("stripe").Stripe.Checkout.Session;
        const userId = s.metadata?.userId;
        if (userId && typeof s.subscription === "string") {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeSubscriptionId: s.subscription,
              stripeCustomerId: typeof s.customer === "string" ? s.customer : undefined,
              status: "ACTIVE",
            },
            create: {
              userId,
              stripeSubscriptionId: s.subscription,
              stripeCustomerId: typeof s.customer === "string" ? s.customer : null,
              status: "ACTIVE",
            },
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as import("stripe").Stripe.Subscription;
        const status = mapStatus(sub.status, event.type);
        const customerId = typeof sub.customer === "string" ? sub.customer : null;
        if (customerId) {
          await prisma.subscription.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              status,
              stripeSubscriptionId: sub.id,
              stripePriceId: sub.items.data[0]?.price?.id ?? null,
              currentPeriodEnd: sub.current_period_end
                ? new Date(sub.current_period_end * 1000)
                : null,
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function mapStatus(status: string, eventType: string): string {
  if (eventType === "customer.subscription.deleted") return "CANCELED";
  switch (status) {
    case "active":
    case "trialing":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELED";
    default:
      return "FREE";
  }
}
