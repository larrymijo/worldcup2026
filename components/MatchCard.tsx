"use client";

import type { Match } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import { formatLocalDate, formatLocalTime, getMatchStatus } from "@/lib/time";
import { stageLabel } from "@/lib/i18n";
import { TeamFlag } from "./TeamFlag";
import { StatusBadge } from "./StatusBadge";
import { useI18n } from "./I18nProvider";

function teamName(team: string, placeholder?: boolean) {
  if (placeholder) return team;
  return TEAMS[team]?.name ?? team;
}

function TeamColumn({
  team,
  placeholder,
  highlight,
}: {
  team: string;
  placeholder?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <TeamFlag team={team} placeholder={placeholder} size={44} />
      <span
        className={`line-clamp-2 text-sm font-semibold leading-tight ${
          highlight ? "text-ec-yellow" : "text-ink"
        } ${placeholder ? "text-muted font-medium" : ""}`}
      >
        {teamName(team, placeholder)}
      </span>
    </div>
  );
}

export function MatchCard({
  match,
  now = Date.now(),
  highlightTeam,
}: {
  match: Match;
  now?: number;
  highlightTeam?: string;
}) {
  const { t, locale } = useI18n();
  const status = getMatchStatus(match.kickoff, now);
  const label = stageLabel(t, match.stage, match.group);
  const hasScore = match.score != null;

  return (
    <article className="glass card-hover rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <TeamColumn
          team={match.home}
          placeholder={match.homePlaceholder}
          highlight={highlightTeam === match.home}
        />

        <div className="flex flex-col items-center justify-center px-1 pt-1">
          {hasScore ? (
            <div className="font-display text-2xl font-bold text-ink">
              {match.score!.home}
              <span className="mx-1 text-muted">-</span>
              {match.score!.away}
            </div>
          ) : (
            <>
              <div className="font-display text-lg font-bold leading-none text-ink sm:text-xl">
                {formatLocalTime(match.kickoff, locale)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted">
                {formatLocalDate(match.kickoff, locale)}
              </div>
            </>
          )}
          {!hasScore && (
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-pitch/70">
              {t("vs")}
            </span>
          )}
        </div>

        <TeamColumn
          team={match.away}
          placeholder={match.awayPlaceholder}
          highlight={highlightTeam === match.away}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/5 pt-3 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5 truncate">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" className="shrink-0">
            <path
              d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="truncate">
            {match.venue} · {match.city}
          </span>
        </span>
        <span className="shrink-0 font-medium text-muted/80">#{match.id}</span>
      </div>
    </article>
  );
}
