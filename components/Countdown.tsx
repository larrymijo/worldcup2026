"use client";

import { useEffect, useState } from "react";
import { countdownParts, msUntil } from "@/lib/time";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <div className="grid w-full place-items-center rounded-xl border border-white/10 bg-white/5 px-1 py-2 font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-muted sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ iso }: { iso: string }) {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMs(msUntil(iso));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [iso]);

  // Avoid hydration mismatch: render nothing until mounted on the client.
  if (ms === null) {
    return <div className="h-[68px]" aria-hidden />;
  }

  if (ms <= 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-ec-red/40 bg-ec-red/15 px-4 py-3 font-display text-lg text-red-200">
        <span className="live-dot h-2.5 w-2.5 rounded-full bg-ec-red" />
        Kick-off!
      </div>
    );
  }

  const { days, hours, minutes, seconds } = countdownParts(ms);
  const Sep = () => (
    <span className="mt-1 self-start pt-1.5 font-display text-xl text-muted sm:text-2xl">:</span>
  );
  return (
    <div className="flex w-full items-start gap-1 sm:gap-2">
      <Unit value={days} label="Days" />
      <Sep />
      <Unit value={hours} label="Hrs" />
      <Sep />
      <Unit value={minutes} label="Min" />
      <Sep />
      <Unit value={seconds} label="Sec" />
    </div>
  );
}
