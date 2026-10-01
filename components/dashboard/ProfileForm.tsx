"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, isPending] = useActionState(updateProfile, { error: null });

  const [alias, setAlias] = useState(profile?.alias ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [message, setMessage] = useState(profile?.message ?? "");
  const [linkUrl, setLinkUrl] = useState(profile?.link_url ?? "");
  const [isAnonymous, setIsAnonymous] = useState(profile?.is_anonymous ?? false);

  const previewName = isAnonymous ? "Anónimo Imperial" : alias || "Sin alias";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: form */}
      <section className="rounded border border-primary/15 bg-surface-container-lowest p-6 sm:p-8 lg:col-span-7">
        <div className="mb-6 flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div>
            <h3 className="flex items-center gap-2.5 font-display text-xl text-on-surface">
              <span className="material-symbols-outlined text-primary">badge</span>
              Datos Personales &amp; Proyección Pública
            </h3>
            <p className="mt-0.5 text-sm text-on-surface-variant">
              Defina cómo se le muestra en el Índice Soberano.
            </p>
          </div>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="aliasInput" className="mb-2 block text-[13px] font-semibold uppercase tracking-wider text-on-surface">
              Alias Público en el Ranking
            </label>
            <input
              id="aliasInput"
              name="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              maxLength={60}
              placeholder="Cómo quieres que te vean"
              className="w-full rounded-lg border border-white/10 bg-surface-container-high px-4 py-3 font-display text-lg text-primary transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-1.5 text-xs text-on-surface-variant/70">
              Este es el nombre visible en el Índice Soberano y en la Tríada Regente si alcanzas el podio.
            </p>
          </div>

          <div>
            <label htmlFor="avatarInput" className="mb-2 block text-[13px] font-semibold uppercase tracking-wider text-on-surface">
              Avatar (URL)
            </label>
            <input
              id="avatarInput"
              name="avatar_url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-white/10 bg-surface-container-high px-4 py-3 text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="mottoTextarea" className="mb-2 block text-[13px] font-semibold uppercase tracking-wider text-on-surface">
              Frase de Poder o Lema Personal
            </label>
            <textarea
              id="mottoTextarea"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Escriba su máxima de soberanía patrimonial..."
              className="w-full resize-none rounded-lg border border-white/10 bg-surface-container-high p-4 font-display text-base italic leading-relaxed text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-1.5 text-right text-xs text-on-surface-variant/70">
              {message.length} / 280 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="linkInput" className="mb-2 block text-[13px] font-semibold uppercase tracking-wider text-on-surface">
              Enlace
            </label>
            <input
              id="linkInput"
              name="link_url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full rounded-lg border border-white/10 bg-surface-container-high px-4 py-3 text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low p-4 text-sm">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent text-primary focus:ring-0"
            />
            <span className="text-on-surface-variant">
              Aparecer como <span className="font-semibold text-primary">&quot;Anónimo&quot;</span> — mantienes tu
              posición y tu tributo, pero se ocultan tu alias, avatar, mensaje y enlace.
            </span>
          </label>

          {state.error && <p className="text-sm text-error">{state.error}</p>}
          {state.success && <p className="text-sm text-emerald-400">Dossier actualizado.</p>}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-fixed via-primary to-primary-container py-3.5 text-[13px] font-bold uppercase tracking-widest text-on-primary shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">lock_open</span>
            {isPending ? "Guardando..." : "Guardar Cambios del Dossier"}
          </button>
        </form>
      </section>

      {/* Right: live preview */}
      <section className="rounded border border-primary/25 bg-surface-container p-5 lg:col-span-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Vista Previa en Vivo
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
            En tiempo real
          </span>
        </div>
        <p className="mb-3 text-xs text-on-surface-variant">
          Así se renderiza su fila en el Índice Soberano público:
        </p>

        <div className="rounded border border-white/10 bg-surface-container-lowest p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-primary/40 bg-surface-container-high">
                {!isAnonymous && avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <span className="truncate font-display text-base font-semibold text-on-surface">
                  {previewName}
                </span>
              </div>
            </div>
            <span className="shrink-0 font-display text-lg font-medium text-primary">
              {(profile?.total_paid ?? 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </span>
          </div>
          {!isAnonymous && message && (
            <p className="mt-3 truncate border-t border-white/5 pt-2.5 font-display text-xs italic text-on-surface-variant/90">
              &ldquo;{message}&rdquo;
            </p>
          )}
        </div>

        <p className="mt-3 text-center text-[11px] text-on-surface-variant/70">
          Los cambios se reflejan al guardar el dossier.
        </p>
      </section>
    </div>
  );
}

