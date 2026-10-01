import type { PublicRankingRow } from "@/types/database";

export function RankingRow({
  row,
  position,
  isCurrentUser,
}: {
  row: PublicRankingRow;
  position: number;
  isCurrentUser?: boolean;
}) {
  return (
    <tr
      className={`group border-b border-outline-variant/20 transition-colors hover:bg-surface-container/60 ${
        isCurrentUser ? "border-l-4 border-l-primary bg-surface-container/70" : ""
      }`}
    >
      <td
        className={`px-4 py-4 text-center font-display text-xl md:px-6 ${
          isCurrentUser ? "font-bold text-primary" : "text-tertiary"
        }`}
      >
        {String(position).padStart(2, "0")}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-surface-container-high">
            {row.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.avatar_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`truncate font-semibold transition-colors ${
                isCurrentUser ? "text-primary" : "text-on-surface group-hover:text-primary"
              }`}
            >
              {row.display_name}
              {isCurrentUser && <span className="ml-1.5 text-xs font-normal text-outline-variant">(Tú)</span>}
            </p>
            {row.message && (
              <p className="hidden max-w-xs truncate text-xs italic text-on-surface-variant lg:block">
                &ldquo;{row.message}&rdquo;
              </p>
            )}
          </div>
        </div>
      </td>
      <td
        className={`whitespace-nowrap px-4 py-4 text-right font-display font-semibold md:px-6 ${
          isCurrentUser ? "text-primary" : "text-on-surface"
        }`}
      >
        {row.total_paid.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
      </td>
    </tr>
  );
}
