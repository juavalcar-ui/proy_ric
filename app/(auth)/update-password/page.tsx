"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/actions/auth";

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, { error: null });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl text-on-surface">Nueva contraseña</h1>

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Nueva contraseña"
          className="rounded border border-outline-variant/40 bg-surface-container-high px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
        />
        {state.error && <p className="text-sm text-error">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-gradient-to-r from-primary-fixed via-primary to-primary-container py-2 text-sm font-semibold uppercase tracking-wider text-on-primary disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
