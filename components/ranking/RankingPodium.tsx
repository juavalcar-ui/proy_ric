import type { PublicRankingRow } from "@/types/database";

const PODIUM_STYLE: Record<
  number,
  { badge: string; icon: string; accentText: string; accentBorder: string }
> = {
  1: {
    badge: "Sovereign Titan",
    icon: "crown",
    accentText: "text-primary",
    accentBorder: "border-primary/50",
  },
  2: {
    badge: "Platinum Apex",
    icon: "military_tech",
    accentText: "text-tertiary-fixed",
    accentBorder: "border-outline-variant/40",
  },
  3: {
    badge: "Aureus Prime",
    icon: "shield_person",
    accentText: "text-secondary",
    accentBorder: "border-outline-variant/40",
  },
};

function formatEUR(amount: number) {
  return amount.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function PodiumCard({
  row,
  position,
  featured,
  className,
}: {
  row: PublicRankingRow;
  position: 1 | 2 | 3;
  featured?: boolean;
  className: string;
}) {
  const style = PODIUM_STYLE[position];

  return (
    <div
      className={`relative overflow-hidden rounded p-6 backdrop-blur-sm transition-all duration-300 ${className} ${
        featured
          ? "border-2 border-primary/50 bg-surface-container p-7 shadow-[0_0_50px_-10px_rgba(212,175,55,0.22)]"
          : `border ${style.accentBorder} bg-surface-container-low/90 hover:border-outline hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)]`
      }`}
    >
      {featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`font-display leading-none ${featured ? "text-5xl" : "text-4xl"} ${style.accentText}`}
        >
          {String(position).padStart(2, "0")}
        </span>
        <span
          className={`material-symbols-outlined ${featured ? "fill-icon text-[30px] text-primary" : "text-[28px]"} ${
            !featured ? style.accentText : ""
          }`}
        >
          {style.icon}
        </span>
      </div>

      <div className="mb-4">
        <span
          className={`inline-block rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
            featured ? "bg-primary text-on-primary" : `border ${style.accentBorder} ${style.accentText} bg-white/5`
          }`}
        >
          {style.badge}
        </span>
        <h3 className={`mt-2 font-body font-semibold text-on-surface ${featured ? "text-xl" : "text-lg"}`}>
          {row.display_name}
        </h3>
      </div>

      {row.message && (
        <blockquote
          className={`my-4 border-l pl-3.5 text-sm italic text-on-surface-variant ${
            featured ? "border-primary" : "border-outline-variant"
          }`}
        >
          &ldquo;{row.message}&rdquo;
        </blockquote>
      )}

      <div
        className={`flex items-end justify-between border-t pt-4 ${
          featured ? "border-primary/20" : "border-outline-variant/20"
        }`}
      >
        <div>
          <div className="text-[11px] uppercase tracking-wider text-outline">Tributo aportado</div>
          <div className={`font-display font-semibold ${featured ? "text-2xl text-primary" : "text-xl text-on-surface"}`}>
            {formatEUR(row.total_paid)}
          </div>
        </div>
        {row.link_url && (
          <a
            href={row.link_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded border border-outline-variant/40 px-3 py-1.5 text-[11px] uppercase tracking-wider text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            Perfil
            <span className="material-symbols-outlined text-[14px]">north_east</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function RankingPodium({ rows }: { rows: PublicRankingRow[] }) {
  const [first, second, third] = rows;
  if (!first) return null;

  return (
    <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
      {second && <PodiumCard row={second} position={2} className="order-2 md:order-1 md:col-span-4" />}
      <PodiumCard row={first} position={1} featured className="order-1 md:order-2 md:col-span-4 md:-translate-y-2" />
      {third && <PodiumCard row={third} position={3} className="order-3 md:order-3 md:col-span-4" />}
    </div>
  );
}
