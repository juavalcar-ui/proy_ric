"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, { error: null });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl text-on-surface">Recuperar contraseña</h1>

      {state.success ? (
        <p className="text-sm text-emerald-400">
          Si el email existe, te hemos enviado un enlace para restablecer la contraseña.
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="rounded border border-outline-variant/40 bg-surface-container-high px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
          />
          {state.error && <p className="text-sm text-error">{state.error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-gradient-to-r from-primary-fixed via-primary to-primary-container py-2 text-sm font-semibold uppercase tracking-wider text-on-primary disabled:opacity-50"
          >
            {isPending ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      )}

      <Link href="/login" className="text-center text-xs text-on-surface-variant hover:text-primary">
        Volver a entrar
      </Link>
    </div>
  );
}
