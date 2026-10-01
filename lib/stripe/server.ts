import "server-only";
import Stripe from "stripe";

// El placeholder solo permite que el build pase sin STRIPE_SECRET_KEY configurada;
// las llamadas reales a la API de Stripe fallarán hasta que definas la clave real.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-08-26.dahlia",
});
