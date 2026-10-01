"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error: string | null; success?: boolean };

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const alias = String(formData.get("alias") ?? "").slice(0, 60) || null;
  const avatar_url = String(formData.get("avatar_url") ?? "").slice(0, 500) || null;
  const message = String(formData.get("message") ?? "").slice(0, 280) || null;
  const link_url = String(formData.get("link_url") ?? "").slice(0, 500) || null;
  const is_anonymous = formData.get("is_anonymous") === "on";

  const { error } = await supabase
    .from("profiles")
    .update({ alias, avatar_url, message, link_url, is_anonymous })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { error: null, success: true };
}
