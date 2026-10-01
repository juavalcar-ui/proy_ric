import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-obsidian-glow px-4">
      <div className="w-full max-w-sm rounded border border-primary/15 bg-surface-container-lowest p-8 shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)]">
        <Link href="/" className="mb-2 flex items-center justify-center gap-2 text-center font-display text-lg tracking-tight text-primary">
          <span className="material-symbols-outlined fill-icon text-[20px]">shield</span>
          SOVEREIGN APEX
        </Link>
        <p className="mb-6 text-center text-[11px] uppercase tracking-widest text-on-surface-variant/70">
          Bóveda Cifrada de Identidad
        </p>
        {children}
      </div>
    </div>
  );
}
