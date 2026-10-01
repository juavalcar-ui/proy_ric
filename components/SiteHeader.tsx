import Link from "next/link";
import { NavMenu } from "@/components/NavMenu";
import { signOut } from "@/app/actions/auth";

export function SiteHeader({
  isAuthenticated,
  ctaHref,
  ctaLabel,
}: {
  isAuthenticated: boolean;
  ctaHref: string;
  ctaLabel: string;
}) {
  const cta = isAuthenticated
    ? { href: ctaHref, label: ctaLabel, icon: "trending_up" }
    : { href: "/login", label: "Iniciar Sesión", icon: "login" };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/30 bg-surface/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.85)] backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 md:px-12">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-xl tracking-tight text-primary">
            SOVEREIGN APEX
          </Link>
          <NavMenu isAuthenticated={isAuthenticated} />
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden items-center gap-2 rounded border border-outline-variant/40 bg-surface-container-lowest px-3 py-1.5 sm:flex">
            <span className="material-symbols-outlined fill-icon text-[15px] text-primary">shield</span>
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant">
              {isAuthenticated ? "Tier Apex I" : "Invitado"}
            </span>
          </div>

          {isAuthenticated && (
            <form action={signOut}>
              <button
                type="submit"
                className="hidden h-10 items-center justify-center rounded border border-outline-variant/20 bg-surface-container-lowest px-3 text-[11px] uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary sm:flex"
              >
                Salir
              </button>
            </form>
          )}

          <Link
            href={cta.href}
            className="flex items-center gap-2 rounded bg-gradient-to-r from-primary-fixed via-primary to-primary-container px-4 py-2.5 text-[13px] font-semibold uppercase tracking-widest text-on-primary shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">{cta.icon}</span>
            <span>{cta.label}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
