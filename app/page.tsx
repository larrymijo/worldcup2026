import Link from "next/link";
import { MatchExplorer } from "@/components/MatchExplorer";
import { NextUp } from "@/components/NextUp";

const STATS = [
  { value: "48", label: "Teams" },
  { value: "104", label: "Matches" },
  { value: "16", label: "Host cities" },
  { value: "3", label: "Nations" },
];

export default function Home() {
  return (
    <>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 -top-16 h-72 w-72 rounded-full bg-pitch/20 blur-3xl" />
          <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            <span className="h-2 w-2 rounded-full bg-pitch" /> June 11 – July 19, 2026
          </span>

          <h1 className="mt-5 max-w-3xl font-display text-[2.6rem] font-bold leading-[1.05] xs:text-5xl sm:text-6xl lg:text-7xl">
            FIFA World Cup <span className="text-gradient">2026</span>
            <br />
            in your local time.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-lg">
            The complete fixture list for the first 48-team World Cup, hosted across
            the USA, Canada &amp; Mexico — every kick-off automatically converted to
            your own timezone.
          </p>

          {/* Next two matches — the first thing you see under the title */}
          <NextUp />

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/ecuador"
              className="bg-ec-grad inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-night shadow-lg shadow-ec-red/20 transition hover:brightness-110"
            >
              🇪🇨 Follow Ecuador
            </Link>
            <a
              href="#fixtures"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-ink transition hover:border-pitch/40 hover:text-pitch"
            >
              Browse all fixtures ↓
            </a>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-2xl px-4 py-4 text-center">
                <dt className="font-display text-3xl font-bold text-ink">{s.value}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div id="fixtures" className="scroll-mt-24 pt-4" />
      <MatchExplorer />
    </>
  );
}
