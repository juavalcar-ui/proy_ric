import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchUserRankInfo } from "@/app/actions/ranking";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

function formatEUR(amount: number) {
  return amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const userRank = await fetchUserRankInfo(user.id);

  return (
    <>
      <SiteHeader isAuthenticated ctaHref="/dashboard/pay" ctaLabel="Ascender Tributo" />

      <main className="mx-auto w-full max-w-[1440px] flex-grow px-4 pb-14 pt-28 md:px-12">
        <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-on-surface-variant">
              <span className="font-medium text-primary">Bóveda Cifrada</span>
              <span>/</span>
              <span className="text-on-surface">Dossier de Identidad</span>
            </div>
            <h1 className="font-display text-3xl tracking-tight text-on-surface">
              Dossier Privado y Configuración de Identidad
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-on-surface-variant/80">
              Ajuste cómo se refleja su prestigio en el Índice Soberano y su nivel de discreción.
            </p>
          </div>
        </div>

        {/* Hero patron card */}
        <section className="relative mb-10 overflow-hidden rounded border border-primary/15 bg-surface-container p-6 shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)] md:p-8">
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex items-center gap-5 sm:gap-7">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-gradient-to-br from-primary-fixed via-primary to-primary-container/60 p-[2px] shadow-2xl">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-surface-container-lowest">
                  <span className="material-symbols-outlined mb-1 text-3xl text-primary">military_tech</span>
                </div>
              </div>
              <div>
                <span className="rounded border border-primary/40 bg-surface-container-high px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-primary">
                  {profile?.is_anonymous ? "Anónimo Imperial" : "Miembro Soberano"}
                </span>
                <h2 className="mt-1.5 font-display text-2xl text-on-surface">
                  {profile?.alias || "Sin alias"}
                </h2>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 border-t border-outline-variant/30 pt-4 sm:grid-cols-3 sm:gap-6 lg:w-auto lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="rounded-lg border border-white/5 bg-surface-container-lowest/90 p-4">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-on-surface-variant">
                  Total Aportado
                </span>
                <div className="font-display text-3xl font-medium text-primary">
                  {formatEUR(profile?.total_paid ?? 0)}
                </div>
              </div>
              <div className="rounded-lg border border-white/5 bg-surface-container-lowest/90 p-4">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-on-surface-variant">
                  Posición Global
                </span>
                <div className="font-display text-3xl font-semibold text-on-surface">
                  {userRank ? `#${userRank.position}` : "—"}
                </div>
              </div>
              <div className="rounded-lg border border-white/5 bg-surface-container-lowest/90 p-4">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-on-surface-variant">
                  Brecha al Siguiente
                </span>
                <div className="font-display text-xl font-normal text-on-surface">
                  {userRank?.gapToNext != null ? formatEUR(userRank.gapToNext) : "—"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProfileForm profile={profile ?? null} />

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-lg border border-white/5 bg-surface-container/90 p-6 backdrop-blur-md sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs uppercase tracking-wider text-on-surface">
              Sesión activa · {user.email}
            </span>
          </div>
          <Link
            href="/dashboard/pay"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-fixed to-primary-container px-8 py-3 text-[13px] font-bold uppercase tracking-widest text-on-primary transition-all hover:brightness-110 sm:w-auto"
          >
            <span className="material-symbols-outlined text-base">trending_up</span>
            Aumentar Contribución
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

