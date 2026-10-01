"use server";

import { createClient } from "@/lib/supabase/server";
import { RANKING_PAGE_SIZE } from "@/lib/ranking";
import type { PublicRankingRow } from "@/types/database";

export async function fetchRankingPage(offset: number): Promise<PublicRankingRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_ranking")
    .select("*")
    .range(offset, offset + RANKING_PAGE_SIZE - 1);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchRankingStats(): Promise<{ totalMembers: number }> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("public_ranking")
    .select("id", { count: "exact", head: true });

  return { totalMembers: count ?? 0 };
}

export type UserRankInfo = {
  position: number;
  totalPaid: number;
  gapToNext: number | null;
  nextDisplayName: string | null;
};

export async function fetchUserRankInfo(userId: string): Promise<UserRankInfo | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_paid")
    .eq("id", userId)
    .single();

  if (!profile || profile.total_paid <= 0) return null;

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gt("total_paid", profile.total_paid);

  const { data: nextBetter } = await supabase
    .from("public_ranking")
    .select("total_paid, display_name")
    .gt("total_paid", profile.total_paid)
    .order("total_paid", { ascending: true })
    .limit(1);

  const next = nextBetter?.[0] ?? null;

  return {
    position: (count ?? 0) + 1,
    totalPaid: profile.total_paid,
    gapToNext: next ? next.total_paid - profile.total_paid : null,
    nextDisplayName: next?.display_name ?? null,
  };
}

