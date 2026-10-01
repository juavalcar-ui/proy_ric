"use client";

import { useMemo, useState, useTransition } from "react";
import { fetchRankingPage } from "@/app/actions/ranking";
import { RANKING_PAGE_SIZE } from "@/lib/ranking";
import type { PublicRankingRow } from "@/types/database";
import { RankingRow } from "./RankingRow";

export function RankingList({
  initialRows,
  initialOffset,
  initialHasMore,
  startPosition,
  currentUserId,
}: {
  initialRows: PublicRankingRow[];
  initialOffset: number;
  initialHasMore: boolean;
  startPosition: number;
  currentUserId?: string;
}) {
  const [rows, setRows] = useState(initialRows);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.display_name.toLowerCase().includes(q) || row.message?.toLowerCase().includes(q)
    );
  }, [rows, query]);

  function loadMore() {
    startTransition(async () => {
      const next = await fetchRankingPage(offset);
      setRows((prev) => [...prev, ...next]);
      setOffset(offset + RANKING_PAGE_SIZE);
      setHasMore(next.length === RANKING_PAGE_SIZE);
    });
  }

  return (
    <section className="overflow-hidden rounded border border-outline-variant/30 bg-surface-container-lowest shadow-2xl">
      <div className="flex flex-col gap-4 border-b border-outline-variant/30 bg-surface-container-low/60 p-5 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h2 className="flex items-center gap-2 font-body text-lg font-semibold text-on-surface">
            <span>El Índice Soberano</span>
            <span className="text-sm font-normal text-outline">
              (Posiciones #{startPosition} — #{startPosition + rows.length - 1})
            </span>
          </h2>
          <p className="mt-0.5 text-sm text-on-surface-variant">
            Registros auditados en tiempo real vía Stripe y Supabase.
          </p>
        </div>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar alias o mensaje..."
            className="w-52 rounded border border-outline-variant/40 bg-surface-container-high px-3.5 py-1.5 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none md:w-64"
          />
          <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-outline">
            search
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low/30 text-[11px] uppercase tracking-widest text-outline">
              <th className="w-16 px-4 py-3.5 text-center md:px-6">Rango</th>
              <th className="px-4 py-3.5">Miembro Soberano</th>
              <th className="px-4 py-3.5 text-right md:px-6">Monto Aportado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredRows.map((row) => (
              <RankingRow
                key={row.id}
                row={row}
                position={startPosition + rows.indexOf(row)}
                isCurrentUser={row.id === currentUserId}
              />
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="p-4">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="w-full rounded border border-outline-variant/40 py-2 text-sm uppercase tracking-wider text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {isPending ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </section>
  );
}

