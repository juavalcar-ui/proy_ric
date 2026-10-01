"use client";

import Link from "next/link";
import { useState } from "react";
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from "@/lib/stripe/shared";

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export default function PayPage() {
  const [amount, setAmount] = useState(25);
  const [currency, setCurrency] = useState<SupportedCurrency>("eur");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear el pago");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded border border-primary/20 bg-surface-container-lowest p-6 shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)] sm:p-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Volver a mi dossier
        </Link>
        <h1 className="mb-1 font-display text-2xl text-on-surface">Ascender Posición</h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          Consolide su tributo y suba en el Índice Soberano.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`rounded border px-3 py-1.5 text-sm font-semibold transition-colors ${
                amount === preset
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-primary/50"
              }`}
            >
              +{preset}
            </button>
          ))}
        </div>

        <label className="mb-4 flex flex-col gap-1 text-sm text-on-surface">
          Cantidad
          <input
            type="number"
            min={1}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="rounded border border-white/10 bg-surface-container-high px-3 py-2 font-display text-lg text-primary outline-none focus:border-primary"
          />
        </label>

        <label className="mb-6 flex flex-col gap-1 text-sm text-on-surface">
          Moneda
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
            className="rounded border border-white/10 bg-surface-container-high px-3 py-2 outline-none focus:border-primary"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <button
          onClick={handlePay}
          disabled={isLoading || amount <= 0}
          className="flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-primary-fixed via-primary to-primary-container py-3 text-[13px] font-bold uppercase tracking-widest text-on-primary shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all hover:shadow-[0_0_35px_rgba(212,175,55,0.55)] disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">lock_open</span>
          {isLoading ? "Redirigiendo a Stripe..." : "Pagar y Ascender"}
        </button>
      </div>
    </div>
  );
}

