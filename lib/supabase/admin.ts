import "server-only";
import { createClient as createServerClient } from "@supabase/supabase-js";

// Cliente con Service Role: solo para uso en Route Handlers de servidor (webhooks de Stripe, etc.)
// Nunca importar desde código que se ejecute en el cliente.
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
