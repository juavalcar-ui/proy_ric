import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/server";
import { SUPPORTED_CURRENCIES } from "@/lib/stripe/shared";

// Crea una transacción 'pending' + una Stripe Checkout Session. El total solo
// se confirma cuando llega el webhook firmado de Stripe (nunca desde el cliente).
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const amount = Number(body?.amount);
  const currency = String(body?.currency ?? "eur").toLowerCase();

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 });
  }
  if (!SUPPORTED_CURRENCIES.includes(currency as (typeof SUPPORTED_CURRENCIES)[number])) {
    return NextResponse.json({ error: "Moneda no soportada" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: transaction, error: insertError } = await admin
    .from("transactions")
    .insert({ user_id: user.id, amount, currency, status: "pending" })
    .select("id")
    .single();

  if (insertError || !transaction) {
    return NextResponse.json({ error: "No se pudo crear la transacción" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.headers.get("origin");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: Math.round(amount * 100),
          product_data: { name: "Contribución al ranking" },
        },
        quantity: 1,
      },
    ],
    metadata: { transaction_id: transaction.id, user_id: user.id },
    success_url: `${siteUrl}/dashboard?payment=success`,
    cancel_url: `${siteUrl}/dashboard/pay?payment=cancelled`,
  });

  await admin
    .from("transactions")
    .update({ stripe_payment_intent_id: session.id })
    .eq("id", transaction.id);

  return NextResponse.json({ url: session.url });
}
