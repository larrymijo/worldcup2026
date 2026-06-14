"use client";

import { useState } from "react";
import type { Match } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import { formatLocalDate, formatLocalTime, statusOf } from "@/lib/time";
import { stageLabel } from "@/lib/i18n";
import { TeamCrest } from "./TeamCrest";
import { StatusBadge } from "./StatusBadge";
import { Modal } from "./Modal";
import { MatchDetailModal } from "./MatchDetailModal";
import { useI18n } from "./I18nProvider";

function teamName(team: string, placeholder?: boolean) {
  if (placeholder) return team;
  return TEAMS[team]?.name ?? team;
}

function TeamColumn({
  team,
  crest,
  placeholder,
  highlight,
}: {
  team: string;
  crest?: string;
  placeholder?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <TeamCrest team={team} crest={crest} placeholder={placeholder} size={44} />
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
  const [open, setOpen] = useState(false);
  const status = statusOf(match, now);
  const label = stageLabel(t, match.stage, match.group);
  const hasScore = match.score != null;
  const goalCount = match.detail?.events?.filter((e) => e.type === "goal").length ?? 0;

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        aria-label={`${t("detail.open")}: ${teamName(match.home, match.homePlaceholder)} vs ${teamName(match.away, match.awayPlaceholder)}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="glass card-hover cursor-pointer rounded-2xl p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pitch/50"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {label}
          </span>
          <StatusBadge status={status} minute={match.minute} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <TeamColumn
            team={match.home}
            crest={match.homeCrest}
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
            crest={match.awayCrest}
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
          <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-muted/80">
            {goalCount > 0 && <span aria-hidden>⚽ {goalCount}</span>}
            <span>#{match.id}</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" className="text-pitch/70">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </article>

      <Modal open={open} onClose={() => setOpen(false)}>
        <MatchDetailModal match={match} now={now} onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
