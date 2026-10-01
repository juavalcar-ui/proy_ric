"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithGoogle, signInWithPassword } from "@/app/actions/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.87c2.27-2.09 3.55-5.17 3.55-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.92l-3.87-2.98c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.07C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.64H1.28A11.94 11.94 0 000 12c0 1.93.46 3.76 1.28 5.36l3.99-3.07z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.64l3.99 3.07C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithPassword, { error: null });
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const registered = searchParams.get("registered") === "1";
  const redirectedFrom = searchParams.get("redirectedFrom");
  const oauthError = searchParams.get("error") === "oauth" || searchParams.get("error") === "auth_callback";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl text-on-surface">Entrar a tu Bóveda</h1>

      {registered && (
        <p className="rounded border border-primary/30 bg-surface-container-low px-3 py-2 text-xs text-primary">
          Cuenta creada. Revisa tu email para confirmarla y luego inicia sesión.
        </p>
      )}
      {redirectedFrom && (
        <p className="rounded border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs text-on-surface-variant">
          Necesitas iniciar sesión para acceder a tu Dossier.
        </p>
      )}
      {oauthError && (
        <p className="rounded border border-error/30 bg-surface-container-low px-3 py-2 text-xs text-error">
          No se pudo completar el acceso. Inténtalo de nuevo.
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          className="rounded border border-outline-variant/40 bg-surface-container-high px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Contraseña"
            autoComplete="current-password"
            className="w-full rounded border border-outline-variant/40 bg-surface-container-high px-3 py-2 pr-10 text-sm text-on-surface outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant hover:text-primary"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        {state.error && <p className="text-sm text-error">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded bg-gradient-to-r from-primary-fixed via-primary to-primary-container py-2 text-sm font-semibold uppercase tracking-wider text-on-primary shadow-[0_0_25px_rgba(212,175,55,0.25)] disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-outline-variant/30" />
        <span className="text-[11px] uppercase tracking-widest text-on-surface-variant/60">o</span>
        <span className="h-px flex-1 bg-outline-variant/30" />
      </div>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2.5 rounded border border-outline-variant/40 bg-surface-container-high py-2 text-sm text-on-surface transition-colors hover:border-primary hover:text-primary"
        >
          <GoogleIcon />
          Continuar con Google
        </button>
      </form>

      <div className="flex justify-between text-xs text-on-surface-variant">
        <Link href="/forgot-password" className="hover:text-primary">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link href="/register" className="hover:text-primary">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
