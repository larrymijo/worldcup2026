"use client";

import type { Match } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import {
  formatLocalDate,
  formatLocalTime,
  formatRelative,
  getMatchStatus,
  msUntil,
} from "@/lib/time";
import { TeamFlag } from "./TeamFlag";
import { StatusBadge } from "./StatusBadge";
import { useMatches, useNow } from "./useMatches";

function TeamSide({ team, placeholder }: { team: string; placeholder?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <TeamFlag team={team} placeholder={placeholder} size={48} />
      <span className="line-clamp-2 text-sm font-semibold leading-tight text-ink">
        {placeholder ? team : (TEAMS[team]?.name ?? team)}
      </span>
    </div>
  );
}

function FeaturedMatch({ match, now }: { match: Match; now: number }) {
  const status = getMatchStatus(match.kickoff, now);
  const label = match.stage === "Group" ? `Group ${match.group}` : match.stage;

  return (
    <article className="glass card-hover relative overflow-hidden rounded-2xl p-5">
      {/* left accent */}
      <span className="bg-pitch-grad absolute inset-y-0 left-0 w-1" aria-hidden />

      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        {status === "upcoming" ? (
          <span className="rounded-full border border-pitch/30 bg-pitch/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-pitch">
            {formatRelative(msUntil(match.kickoff, now))}
          </span>
        ) : (
          <StatusBadge status={status} />
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
        <TeamSide team={match.home} placeholder={match.homePlaceholder} />
        <div className="flex flex-col items-center px-0.5">
          <div className="whitespace-nowrap font-display text-xl font-bold leading-none text-ink sm:text-2xl">
            {formatLocalTime(match.kickoff)}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-muted">
            {formatLocalDate(match.kickoff)}
          </div>
        </div>
        <TeamSide team={match.away} placeholder={match.awayPlaceholder} />
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-white/5 pt-3 text-[11px] text-muted">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" className="shrink-0">
          <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="truncate">
          {match.venue} · {match.city}
        </span>
      </div>
    </article>
  );
}

export function NextUp() {
  const { matches, loading, error } = useMatches();
  const now = useNow();

  if (error) return null;

  const upcoming = matches
    .filter((m) => getMatchStatus(m.kickoff, now) !== "finished")
    .sort((a, b) => +new Date(a.kickoff) - +new Date(b.kickoff))
    .slice(0, 2);

  if (!loading && upcoming.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <span className="live-dot h-2 w-2 rounded-full bg-pitch" />
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink">
          Up next
        </h2>
        <span className="hidden text-xs text-muted xs:inline">
          · the next two kickoffs, in your time
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass h-44 animate-pulse rounded-2xl" />
            ))
          : upcoming.map((m) => <FeaturedMatch key={m.id} match={m} now={now} />)}
      </div>
    </section>
  );
}
