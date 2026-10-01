import Link from "next/link";
import { fetchRankingPage, fetchRankingStats, fetchUserRankInfo } from "@/app/actions/ranking";
import { RANKING_PAGE_SIZE } from "@/lib/ranking";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { RankingPodium } from "@/components/ranking/RankingPodium";
import { RankingList } from "@/components/ranking/RankingList";
import { createClient } from "@/lib/supabase/server";

function formatEUR(amount: number) {
  return amount.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [firstPage, stats, userRank] = await Promise.all([
    fetchRankingPage(0),
    fetchRankingStats(),
    user ? fetchUserRankInfo(user.id) : Promise.resolve(null),
  ]);

  const podiumRows = firstPage.slice(0, 3);
  const tableRows = firstPage.slice(3);
  const leader = firstPage[0];

  return (
    <>
      <SiteHeader
        isAuthenticated={!!user}
        ctaHref={user ? "/dashboard/pay" : "/login"}
        ctaLabel="Ascender Tributo"
      />

      <main className="mx-auto w-full max-w-[1440px] flex-grow px-4 pb-14 pt-28 md:px-12">
        {/* Hero */}
        <section className="mx-auto mb-12 max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface-container-low px-4 py-1.5">
            <span className="material-symbols-outlined text-[14px] text-primary">stars</span>
            <span className="text-[11px] uppercase tracking-widest text-primary">
              El Olimpo de los Privilegiados
            </span>
          </div>
          <h1 className="mb-4 font-display text-4xl tracking-tight text-on-surface sm:text-5xl">
            The Sovereign Index
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Donde el capital soberano no se presume ni se insinúa: se certifica, se custodia y se
            inmortaliza en tiempo real.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-outline-variant/20 pt-6 sm:grid-cols-3">
            <div className="rounded border border-outline-variant/20 bg-surface-container-low/70 p-3.5 text-left">
              <div className="text-[11px] uppercase text-outline">Líder Absoluto</div>
              <div className="mt-1 font-display text-xl font-semibold text-primary">
                {leader ? formatEUR(leader.total_paid) : "—"}
              </div>
              <div className="mt-0.5 text-[11px] text-on-surface-variant">
                {leader?.display_name ?? "Aún sin líder"}
              </div>
            </div>
            <div className="rounded border border-outline-variant/20 bg-surface-container-low/70 p-3.5 text-left">
              <div className="text-[11px] uppercase text-outline">Soberanos Registrados</div>
              <div className="mt-1 font-display text-xl font-semibold text-on-surface">
                {stats.totalMembers} Miembros
              </div>
              <div className="mt-0.5 text-[11px] text-emerald-400/80">Pagos verificados</div>
            </div>
            <div className="rounded border border-outline-variant/20 bg-surface-container-low/70 p-3.5 text-left">
              <div className="text-[11px] uppercase text-outline">Liquidación</div>
              <div className="mt-1 font-display text-xl font-semibold text-on-surface">Stripe Checkout</div>
              <div className="mt-0.5 text-[11px] text-outline">Confirmación por webhook</div>
            </div>
          </div>
        </section>

        {/* Podium */}
        {podiumRows.length > 0 && (
          <section className="mb-14">
            <div className="mb-6 flex items-center gap-3 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined fill-icon text-[22px] text-primary">
                workspace_premium
              </span>
              <h2 className="font-display text-2xl text-on-surface">La Tríada Regente</h2>
            </div>
            <RankingPodium rows={podiumRows} />
          </section>
        )}

        {/* Pinned user status */}
        {user && userRank && (
          <div className="sticky top-24 z-30 mb-10">
            <div className="flex flex-col items-center justify-between gap-4 border-y border-primary/40 bg-surface-container-high/95 p-4 shadow-[0_12px_35px_-8px_rgba(0,0,0,0.9)] backdrop-blur-md md:flex-row md:rounded md:border md:px-6">
              <div className="flex w-full items-center gap-4 md:w-auto">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-primary/40 bg-primary/10">
                  <span className="font-display text-lg font-bold text-primary">#{userRank.position}</span>
                </div>
                <div>
                  <span className="font-semibold text-on-surface">Tu posición</span>
                  <p className="text-sm text-on-surface-variant">
                    Tributo acumulado: <span className="font-semibold text-on-surface">{formatEUR(userRank.totalPaid)}</span>
                  </p>
                </div>
              </div>

              {userRank.gapToNext !== null && (
                <div className="w-full rounded border border-outline-variant/30 bg-surface-container-lowest/80 px-4 py-2 text-left md:w-auto md:text-center">
                  <span className="block text-[11px] uppercase tracking-wider text-outline">
                    Brecha al puesto #{userRank.position - 1}
                  </span>
                  <span className="font-semibold text-primary">{formatEUR(userRank.gapToNext)}</span>
                </div>
              )}

              <Link
                href="/dashboard/pay"
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded bg-gradient-to-r from-primary-fixed via-primary to-primary-container px-5 py-2.5 text-[13px] font-semibold uppercase tracking-widest text-on-primary shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] md:w-auto"
              >
                <span className="material-symbols-outlined text-[18px]">upgrade</span>
                Pagar Tributo y Superar
              </Link>
            </div>
          </div>
        )}

        {user && !userRank && (
          <div className="mb-10 flex flex-col items-center justify-between gap-4 rounded border border-primary/30 bg-surface-container-low/70 p-5 sm:flex-row">
            <p className="text-sm text-on-surface-variant">
              Aún no apareces en el índice. Realiza tu primer tributo para reclamar tu posición.
            </p>
            <Link
              href="/dashboard/pay"
              className="flex shrink-0 items-center gap-2 rounded bg-primary px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-on-primary"
            >
              Entrar al índice
            </Link>
          </div>
        )}

        {/* Zenith index table */}
        {tableRows.length === 0 ? (
          firstPage.length === 0 && (
            <p className="text-center text-on-surface-variant">
              Aún no hay nadie en el ranking. ¡Sé el primero!
            </p>
          )
        ) : (
          <RankingList
            initialRows={tableRows}
            initialOffset={RANKING_PAGE_SIZE}
            initialHasMore={firstPage.length === RANKING_PAGE_SIZE}
            startPosition={4}
            currentUserId={user?.id}
          />
        )}

        {/* Protocol cards */}
        <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: "enhanced_encryption",
              title: "Protocolo de No-Repudio",
              text: "Cada tributo aportado es irrevocablemente consolidado. No existen reembolsos; el estatus es perpetuo o superado.",
            },
            {
              icon: "lock_clock",
              title: "Discreción Opcional",
              text: "Los miembros pueden ocultar su alias en cualquier momento y aparecer como \u201cAnónimo\u201d sin perder su posición.",
            },
            {
              icon: "concierge",
              title: "Ascenso Instantáneo",
              text: "Cada pago se confirma vía Stripe y actualiza tu posición en el siguiente refresco del índice.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded border border-outline-variant/20 bg-surface-container-low/60 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded border border-outline-variant/40 bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
              </div>
              <h3 className="mb-2 font-semibold text-on-surface">{card.title}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">{card.text}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}

