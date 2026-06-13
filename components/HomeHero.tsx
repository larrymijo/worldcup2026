"use client";

import Link from "next/link";
import { NextUp } from "./NextUp";
import { OrganiskAnimated } from "./Sponsor";
import { useI18n } from "./I18nProvider";

export function HomeHero() {
  const { t } = useI18n();

  const stats = [
    { value: "48", label: t("stats.teams") },
    { value: "104", label: t("stats.matches") },
    { value: "16", label: t("stats.cities") },
    { value: "3", label: t("stats.nations") },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 -top-16 h-72 w-72 rounded-full bg-pitch/20 blur-3xl" />
        <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              <span className="h-2 w-2 rounded-full bg-pitch" /> {t("home.dates")}
            </span>

            <h1 className="mt-5 font-display text-[2.6rem] font-bold leading-[1.05] xs:text-5xl sm:text-6xl lg:text-7xl">
              {t("home.titlePre")}
              <span className="text-gradient">2026</span>
              <br />
              {t("home.titleLine2")}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-lg">
              {t("home.subtitle")}
            </p>
          </div>

          {/* Animated sponsor — beside the title on desktop, below it on mobile */}
          <OrganiskAnimated className="self-start lg:shrink-0 lg:self-center" />
        </div>

        {/* Next two matches — the first thing you see under the title */}
        <NextUp />

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/ecuador"
            className="bg-ec-grad inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-night shadow-lg shadow-ec-red/20 transition hover:brightness-110"
          >
            🇪🇨 {t("home.followEc")}
          </Link>
          <a
            href="#fixtures"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-ink transition hover:border-pitch/40 hover:text-pitch"
          >
            {t("home.browse")} ↓
          </a>
        </div>

        <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
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
  );
}
