"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUpWithPassword } from "@/app/actions/auth";

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-1.5 ${met ? "text-primary" : "text-on-surface-variant/60"}`}>
      <span className="material-symbols-outlined text-[14px]">
        {met ? "check_circle" : "radio_button_unchecked"}
      </span>
      {label}
    </li>
  );
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpWithPassword, { error: null });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hasLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isValid = hasLength && hasLetter && hasNumber && passwordsMatch;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl text-on-surface">Crear cuenta</h1>

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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoComplete="new-password"
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
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar contraseña"
          autoComplete="new-password"
          className="rounded border border-outline-variant/40 bg-surface-container-high px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
        />

        <ul className="flex flex-col gap-1 text-xs">
          <Requirement met={hasLength} label="Al menos 8 caracteres" />
          <Requirement met={hasLetter && hasNumber} label="Una letra y un número" />
          <Requirement met={passwordsMatch} label="Las contraseñas coinciden" />
        </ul>

        {state.error && <p className="text-sm text-error">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending || !isValid}
          className="rounded bg-gradient-to-r from-primary-fixed via-primary to-primary-container py-2 text-sm font-semibold uppercase tracking-wider text-on-primary disabled:opacity-50"
        >
          {isPending ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <Link href="/login" className="text-center text-xs text-on-surface-variant hover:text-primary">
        ¿Ya tienes cuenta? Entra
      </Link>
    </div>
  );
}
