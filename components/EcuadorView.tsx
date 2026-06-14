"use client";

import type { Match } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import { formatLocalDateLong, formatLocalTime, statusOf } from "@/lib/time";
import { stageLabel } from "@/lib/i18n";
import { MatchCard } from "./MatchCard";
import { Countdown } from "./Countdown";
import { TeamFlag } from "./TeamFlag";
import { OrganiskBadge, OrganiskSupportsEcuador } from "./Sponsor";
import { useMatches, useNow } from "./useMatches";
import { useI18n } from "./I18nProvider";

const GROUP_E = ["Germany", "Ecuador", "Ivory Coast", "Curaçao"];

function opponentOf(m: Match): { team: string; venue: boolean } {
  const isHome = m.home === "Ecuador";
  return { team: isHome ? m.away : m.home, venue: isHome };
}

export function EcuadorView() {
  const { t, locale } = useI18n();
  const { matches, loading, error } = useMatches();
  const now = useNow();

  const ecuador = matches
    .filter((m) => m.home === "Ecuador" || m.away === "Ecuador")
    .sort((a, b) => +new Date(a.kickoff) - +new Date(b.kickoff));

  const nextMatch =
    ecuador.find((m) => statusOf(m, now) !== "finished") ?? ecuador.at(-1);

  return (
    <div>
      {/* ----------------------------- Hero ----------------------------- */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Ecuador color wash */}
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-ec-yellow/20 blur-3xl" />
          <div className="absolute left-1/3 -top-10 h-72 w-72 rounded-full bg-ec-blue/30 blur-3xl" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-ec-red/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <span className="float-slow text-base">🇪🇨</span> {t("ec.badge")}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
                <span className="text-gradient-ec">Ecuador</span>
                <br />
                {t("ec.titleLine2")}
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                {t("ec.subtitle")}
              </p>
              <div className="mt-5">
                <OrganiskBadge labelKey="sponsor.officialSponsor" />
              </div>
            </div>

            {/* Next match card */}
            <div className="w-full max-w-md lg:w-[26rem]">
              {nextMatch ? <NextMatchPanel match={nextMatch} now={now} /> : (
                <div className="glass rounded-2xl p-6 text-center text-muted">
                  {loading ? t("ec.loading") : t("ec.unavailable")}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {error && (
          <div className="mb-8 rounded-2xl border border-ec-red/30 bg-ec-red/10 p-6 text-center text-sm text-red-200">
            {t("error.schedule", { error })}
          </div>
        )}

        {/* ----------------------- Sponsor ----------------------- */}
        <OrganiskSupportsEcuador className="mb-10" />

        {/* ----------------------- Fixtures ----------------------- */}
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            {t("ec.fixtures")}
          </h2>
          <div className="hairline flex-1" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass h-44 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ecuador.map((m) => (
              <MatchCard key={m.id} match={m} now={now} highlightTeam="Ecuador" />
            ))}
          </div>
        )}

        {/* ----------------------- Group E ----------------------- */}
        <div className="mb-4 mt-12 flex items-center gap-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            {t("ec.glance")}
          </h2>
          <div className="hairline flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GROUP_E.map((team) => {
            const isEc = team === "Ecuador";
            return (
              <div
                key={team}
                className={`glass flex items-center gap-3 rounded-2xl p-4 ${
                  isEc ? "ring-2 ring-ec-yellow/60" : ""
                }`}
              >
                <TeamFlag team={team} size={40} />
                <span
                  className={`text-sm font-semibold ${isEc ? "text-ec-yellow" : "text-ink"}`}
                >
                  {TEAMS[team]?.name ?? team}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NextMatchPanel({ match, now }: { match: Match; now: number }) {
  const { t, locale } = useI18n();
  const status = statusOf(match, now);
  const { team, venue } = opponentOf(match);
  const isLiveOrFinished = status !== "upcoming";
  const hasScore = match.score != null && isLiveOrFinished;

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {status === "finished"
            ? t("ec.last")
            : status === "live"
              ? t("ec.playing")
              : t("ec.next")}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-muted">
          {stageLabel(t, match.stage, match.group)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <TeamFlag team="Ecuador" size={52} />
          <span className="text-sm font-bold text-ec-yellow">Ecuador</span>
        </div>
        {hasScore ? (
          <span className="font-display text-3xl font-bold text-ink">
            {match.score!.home}
            <span className="mx-1.5 text-muted">-</span>
            {match.score!.away}
          </span>
        ) : (
          <span className="font-display text-sm text-muted">{venue ? t("vs") : t("at")}</span>
        )}
        <div className="flex flex-col items-center gap-2">
          <TeamFlag team={team} size={52} />
          <span className="text-sm font-bold text-ink">{TEAMS[team]?.name ?? team}</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/5 bg-night-2/60 p-4 text-center">
        <p className="text-sm font-semibold text-ink">{formatLocalDateLong(match.kickoff, locale)}</p>
        <p className="text-xs text-muted">
          {formatLocalTime(match.kickoff, locale)} · {match.venue}, {match.city}
        </p>
      </div>

      <div className="mt-5 flex justify-center">
        {isLiveOrFinished ? (
          <span
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
              status === "live"
                ? "border-ec-red/40 bg-ec-red/15 text-red-200"
                : "border-white/10 bg-white/5 text-muted"
            }`}
          >
            {status === "live" && <span className="live-dot h-2 w-2 rounded-full bg-ec-red" />}
            {status === "live"
              ? `${t("ec.inProgress")}${match.minute ? ` · ${match.minute === "HT" ? t("status.ht") : match.minute}` : ""}`
              : t("status.ft")}
          </span>
        ) : (
          <Countdown iso={match.kickoff} />
        )}
      </div>
    </div>
  );
}
