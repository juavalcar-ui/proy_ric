"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "El Índice Global" },
  { href: "/dashboard", label: "Mi Dossier" },
];

export function NavMenu({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {TABS.map((tab) => {
        const isDashboardTab = tab.href === "/dashboard";
        const locked = isDashboardTab && !isAuthenticated;
        const href = locked ? "/login" : tab.href;
        const active = isDashboardTab ? pathname.startsWith("/dashboard") : pathname === "/";

        return (
          <Link
            key={tab.href}
            href={href}
            className={`flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-widest transition-colors ${
              active
                ? "border-b border-primary pb-1 text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
            {locked && <span className="material-symbols-outlined text-[14px]">lock</span>}
          </Link>
        );
      })}
    </nav>
  );
}

