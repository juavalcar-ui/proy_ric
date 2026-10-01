import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Única fuente de verdad para confirmar pagos: valida la firma de Stripe antes de tocar la BD.
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Falta firma" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firma inválida";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const transactionId = session.metadata?.transaction_id;

    if (transactionId) {
      const admin = createAdminClient();
      await admin
        .from("transactions")
        .update({ status: "succeeded", stripe_payment_intent_id: session.id })
        .eq("id", transactionId)
        .eq("status", "pending");
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const transactionId = session.metadata?.transaction_id;

    if (transactionId) {
      const admin = createAdminClient();
      await admin
        .from("transactions")
        .update({ status: "failed" })
        .eq("id", transactionId)
        .eq("status", "pending");
    }
  }

  return NextResponse.json({ received: true });
}
