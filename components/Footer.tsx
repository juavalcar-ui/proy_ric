const LINKS = [
  "Discretion Protocol",
  "Audited Reserves",
  "Private Key Governance",
  "Encrypted Transmission",
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-outline-variant/20 bg-surface-container-lowest">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row md:px-12">
        <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
          <div className="font-display text-xl tracking-tight text-primary">SOVEREIGN APEX</div>
          <p className="max-w-md text-xs text-on-surface-variant/70">
            © {new Date().getFullYear()} Sovereign Apex. Cryptographic Discretion Ensured.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/70 transition-colors hover:text-primary hover:underline hover:underline-offset-4"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
