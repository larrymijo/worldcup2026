export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            <span className="font-display text-ink">WORLD CUP 26 · Match Center</span>
            <span className="mx-2 text-line">|</span>
            Kick-off times shown in your local timezone.
          </p>
          <p className="text-xs">
            Unofficial fan project · Schedule data: FIFA World Cup 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
