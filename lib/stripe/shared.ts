export const SUPPORTED_CURRENCIES = ["eur", "usd", "gbp"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
