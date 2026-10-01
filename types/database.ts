export type Profile = {
  id: string;
  alias: string | null;
  avatar_url: string | null;
  message: string | null;
  link_url: string | null;
  is_anonymous: boolean;
  total_paid: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  status: "pending" | "succeeded" | "failed";
  created_at: string;
};

export type PublicRankingRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  message: string | null;
  link_url: string | null;
  total_paid: number;
};
