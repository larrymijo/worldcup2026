"use client";

import { useMemo } from "react";
import { GROUP_LETTERS, GROUPS } from "@/lib/groups";
import { TEAMS } from "@/lib/teams";
import { statusOf } from "@/lib/time";
import {
  rankThirds,
  tableFromMatches,
  topScorers,
  tournamentStats,
  type StandingRow,
} from "@/lib/standings";
import { StandingsTable } from "./StandingsTable";
import { TeamCrest } from "./TeamCrest";
import { OrganiskBadge } from "./Sponsor";
import { useMatches, useNow } from "./useMatches";
import { useI18n } from "./I18nProvider";

const name = (t: string) => TEAMS[t]?.name ?? t;

export function GroupsView() {
  const { t, locale } = useI18n();
  const { matches, loading } = useMatches();
  const now = useNow();

  const crests = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of matches) {
      if (m.homeCrest && !map[m.home]) map[m.home] = m.homeCrest;
      if (m.awayCrest && !map[m.away]) map[m.away] = m.awayCrest;
    }
    return map;
  }, [matches]);

  const finished = useMemo(
    () => matches.filter((m) => m.score != null && statusOf(m, now) === "finished"),
    [matches, now],
  );

  const tablesByGroup = useMemo(() => {
    const out: Record<string, StandingRow[]> = {};
    for (const g of GROUP_LETTERS) {
      const fx = finished.filter((m) => m.stage === "Group" && m.group === g);
      out[g] = tableFromMatches(GROUPS[g], fx, g);
    }
    return out;
  }, [finished]);

  const thirds = useMemo(() => rankThirds(tablesByGroup), [tablesByGroup]);
  const scorers = useMemo(() => topScorers(matches).slice(0, 16), [matches]);
  const stats = useMemo(() => tournamentStats(finished), [finished]);
  const hasResults = stats.played > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 sm:pt-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 -top-16 h-72 w-72 rounded-full bg-pitch/15 blur-3xl" />
          <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-sky/15 blur-3xl" />
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            📊 {t("nav.groups")}
          </span>
          <h1 className="mt-4 font-display text-[2.4rem] font-bold leading-[1.05] xs:text-5xl sm:text-6xl">
            {t("gr.titlePre")}
            <span className="text-gradient">{t("gr.titleHl")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{t("gr.subtitle")}</p>
          <div className="mt-6">
            <OrganiskBadge labelKey="sponsor.broughtBy" />
          </div>
        </div>
      </section>

      {/* Tournament stats */}
      {hasResults && (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label={t("gr.played")} value={String(stats.played)} />
          <Stat label={t("gr.goals")} value={String(stats.goals)} />
          <Stat label={t("gr.avg")} value={stats.avg.toFixed(2)} />
          <Stat label={t("gr.cleanSheets")} value={String(stats.cleanSheets)} />
          <Stat label={t("gr.cards")} value={String(stats.cards)} />
          <Stat label={t("gr.attendance")} value={compact(stats.attendance, locale)} />
        </section>
      )}

      {!loading && !hasResults && (
        <p className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-muted">
          {t("gr.noResults")}
        </p>
      )}

      {/* Group tables */}
      <SectionTitle>{t("gr.tables")}</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GROUP_LETTERS.map((g) => (
          <div key={g} className="glass rounded-2xl p-3 sm:p-4">
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-pitch-grad text-xs font-bold text-night">
                {g}
              </span>
              <h3 className="font-display text-sm font-bold tracking-wide text-ink">
                {t("stage.group")} {g}
              </h3>
            </div>
            <StandingsTable rows={tablesByGroup[g]} crests={crests} highlightThird highlightTeam="Ecuador" />
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top scorers */}
        <div>
          <SectionTitle>{t("gr.scorers")}</SectionTitle>
          {scorers.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-sm text-muted">
              {t("gr.noResults")}
            </p>
          ) : (
            <ol className="glass divide-y divide-white/5 overflow-hidden rounded-2xl">
              {scorers.map((s, i) => (
                <li key={`${s.player}-${s.team}`} className="flex items-center gap-3 px-3 py-2.5">
                  <span className={`w-5 text-center font-display text-sm font-bold ${i < 3 ? "text-gold" : "text-muted"}`}>
                    {i + 1}
                  </span>
                  <TeamCrest team={s.team} crest={crests[s.team]} size={26} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{s.player}</span>
                    <span className="block truncate text-[11px] text-muted">{name(s.team)}</span>
                  </span>
                  {s.penalties > 0 && (
                    <span className="text-[10px] text-muted">
                      {s.penalties} {t("detail.pen")}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 font-display text-lg font-bold tabular-nums text-ink">
                    {s.goals}
                    <span aria-hidden className="text-xs">⚽</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Best third-placed teams */}
        <div>
          <SectionTitle>{t("gr.thirds")}</SectionTitle>
          <p className="mb-3 text-xs text-muted">{t("gr.thirdsHint")}</p>
          <ol className="glass divide-y divide-white/5 overflow-hidden rounded-2xl">
            {thirds.map((r, i) => {
              const advances = i < 8;
              return (
                <li
                  key={r.team}
                  className={`flex items-center gap-3 px-3 py-2.5 ${advances ? "" : "opacity-50"}`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                      advances ? "bg-pitch text-night" : "bg-white/10 text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <TeamCrest team={r.team} crest={crests[r.team]} size={24} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                    {name(r.team)}{" "}
                    <span className="text-[11px] text-muted">· {t("stage.group")} {r.group}</span>
                  </span>
                  <span className="text-[11px] tabular-nums text-muted">
                    {r.pts} {t("tbl.pts")} · {r.gd > 0 ? `+${r.gd}` : r.gd}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className="font-display text-2xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 mt-12 flex items-center gap-3">
      <h2 className="font-display text-lg font-semibold tracking-wide text-ink">{children}</h2>
      <div className="hairline flex-1" />
    </div>
  );
}

function compact(n: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
  } catch {
    return String(n);
  }
}
