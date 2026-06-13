"use client";

import { useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import { formatLocalDateLong, getMatchStatus, groupByLocalDate } from "@/lib/time";
import { MatchCard } from "./MatchCard";
import { useMatches, useNow } from "./useMatches";
import { useI18n } from "./I18nProvider";

type StageFilter = "all" | "group" | "knockout";

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

function searchText(m: Match): string {
  const home = TEAMS[m.home]?.name ?? m.home;
  const away = TEAMS[m.away]?.name ?? m.away;
  return `${home} ${away} ${m.city} ${m.venue} ${m.group ?? ""} ${m.stage}`.toLowerCase();
}

export function MatchExplorer() {
  const { t, locale } = useI18n();
  const { matches, loading, error } = useMatches();
  const now = useNow();

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [stage, setStage] = useState<StageFilter>("all");
  const [onlyUpcoming, setOnlyUpcoming] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matches.filter((m) => {
      if (q && !searchText(m).includes(q)) return false;
      if (group !== "all" && m.group !== group) return false;
      if (stage === "group" && m.stage !== "Group") return false;
      if (stage === "knockout" && m.stage === "Group") return false;
      if (onlyUpcoming && getMatchStatus(m.kickoff, now) === "finished") return false;
      return true;
    });
  }, [matches, query, group, stage, onlyUpcoming, now]);

  const days = useMemo(() => groupByLocalDate(filtered), [filtered]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      {/* Controls (sticky only on larger screens so phones aren't dominated by it) */}
      <div className="glass z-30 mb-6 rounded-2xl px-3 py-3 sm:sticky sm:top-16 sm:-mx-2 sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("filters.search")}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stage segmented control */}
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              {([
                ["all", t("filters.all")],
                ["group", t("filters.groups")],
                ["knockout", t("filters.knockouts")],
              ] as [StageFilter, string][]).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setStage(value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    stage === value ? "bg-white text-night" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Group select */}
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-ink focus:border-pitch/50 focus:outline-none"
            >
              <option value="all" className="bg-night">{t("filters.allGroups")}</option>
              {GROUPS.map((g) => (
                <option key={g} value={g} className="bg-night">
                  {t("stage.group")} {g}
                </option>
              ))}
            </select>

            {/* Upcoming toggle */}
            <button
              onClick={() => setOnlyUpcoming((v) => !v)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                onlyUpcoming
                  ? "border-pitch/50 bg-pitch/15 text-pitch"
                  : "border-white/10 bg-white/5 text-muted hover:text-ink"
              }`}
            >
              {t("filters.upcomingOnly")}
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted">
          <span>
            {loading
              ? t("filters.loading")
              : t(filtered.length === 1 ? "filters.countOne" : "filters.countOther", {
                  n: filtered.length,
                })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {t("filters.yourTime")}
          </span>
        </div>
      </div>

      {/* States */}
      {error && (
        <div className="rounded-2xl border border-ec-red/30 bg-ec-red/10 p-6 text-center text-sm text-red-200">
          {t("error.schedule", { error })}
        </div>
      )}

      {loading && !error && <SkeletonList />}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-muted">
          <p className="font-display text-lg text-ink">{t("empty.title")}</p>
          <p className="mt-1 text-sm">{t("empty.desc")}</p>
        </div>
      )}

      {/* Day-grouped results */}
      <div className="space-y-8">
        {days.map((day) => (
          <div key={day.key} className="animate-in">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink">
                {formatLocalDateLong(day.iso, locale)}
              </h2>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-muted">
                {day.matches.length}
              </span>
              <div className="hairline flex-1" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {day.matches.map((m) => (
                <MatchCard key={m.id} match={m} now={now} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonList() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass h-44 animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}
