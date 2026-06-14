"use client";

import type { Match, TeamStats } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import { formatLocalDateLong, formatLocalTime, statusOf } from "@/lib/time";
import { stageLabel } from "@/lib/i18n";
import { TeamCrest } from "./TeamCrest";
import { StatusBadge } from "./StatusBadge";
import { useI18n } from "./I18nProvider";

function teamName(team: string, placeholder?: boolean) {
  return placeholder ? team : TEAMS[team]?.name ?? team;
}

function FormPips({ form }: { form: string }) {
  return (
    <span className="inline-flex gap-1">
      {form.split("").slice(-5).map((r, i) => {
        const c = r === "W" ? "bg-pitch text-night" : r === "L" ? "bg-ec-red/80 text-white" : "bg-white/15 text-ink";
        return (
          <span key={i} className={`grid h-4 w-4 place-items-center rounded text-[9px] font-bold ${c}`}>
            {r}
          </span>
        );
      })}
    </span>
  );
}

export function MatchDetailModal({
  match,
  now,
  onClose,
}: {
  match: Match;
  now: number;
  onClose: () => void;
}) {
  const { t, locale } = useI18n();
  const status = statusOf(match, now);
  const d = match.detail;
  const hasScore = match.score != null && status !== "upcoming";
  const homeNm = teamName(match.home, match.homePlaceholder);
  const awayNm = teamName(match.away, match.awayPlaceholder);

  const goals = (d?.events ?? []).filter((e) => e.type === "goal");
  const cards = (d?.events ?? []).filter((e) => e.type !== "goal");

  const metrics: { label: string; key: keyof TeamStats; pct?: boolean }[] = [
    { label: t("detail.possession"), key: "possession", pct: true },
    { label: t("detail.shots"), key: "shots" },
    { label: t("detail.shotsOnTarget"), key: "shotsOnTarget" },
    { label: t("detail.fouls"), key: "fouls" },
    { label: t("detail.corners"), key: "corners" },
  ];
  const statRows = d?.stats
    ? metrics.filter((m) => d.stats!.home[m.key] != null || d.stats!.away[m.key] != null)
    : [];

  const goalLabel = (g: (typeof goals)[number]) =>
    `${g.player}${g.penalty ? ` (${t("detail.pen")})` : ""}${g.ownGoal ? ` (${t("detail.og")})` : ""}`;

  return (
    <div className="text-ink">
      {/* drag handle (mobile) */}
      <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/15 sm:hidden" />

      {/* header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-white/10 bg-card/95 px-5 py-3 backdrop-blur">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {stageLabel(t, match.stage, match.group)}
        </span>
        <div className="flex items-center gap-2">
          {status === "upcoming" ? (
            <StatusBadge status="upcoming" />
          ) : (
            <StatusBadge status={status} minute={match.minute} />
          )}
          <button
            onClick={onClose}
            aria-label={t("detail.close")}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-muted transition hover:text-ink"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-5 py-5">
        {/* scoreline */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamCrest team={match.home} crest={match.homeCrest} placeholder={match.homePlaceholder} size={56} />
            <span className="text-sm font-semibold leading-tight">{homeNm}</span>
            {d?.form?.home && <FormPips form={d.form.home} />}
          </div>
          <div className="flex flex-col items-center">
            {hasScore ? (
              <div className="font-display text-4xl font-bold tabular-nums">
                {match.score!.home}
                <span className="mx-1.5 text-muted">-</span>
                {match.score!.away}
              </div>
            ) : (
              <div className="text-center">
                <div className="font-display text-2xl font-bold">{formatLocalTime(match.kickoff, locale)}</div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamCrest team={match.away} crest={match.awayCrest} placeholder={match.awayPlaceholder} size={56} />
            <span className="text-sm font-semibold leading-tight">{awayNm}</span>
            {d?.form?.away && <FormPips form={d.form.away} />}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-muted">
          {formatLocalDateLong(match.kickoff, locale)} · {formatLocalTime(match.kickoff, locale)}
        </p>

        {/* goal scorers */}
        {goals.length > 0 && (
          <section className="mt-5">
            <h3 className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              ⚽ {t("detail.scorers")}
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <ul className="space-y-1">
                {goals.filter((g) => g.side === "home").map((g, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="tabular-nums text-xs text-pitch">{g.minute}</span>
                    <span className="truncate">{goalLabel(g)}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 text-right">
                {goals.filter((g) => g.side === "away").map((g, i) => (
                  <li key={i} className="flex items-center justify-end gap-1.5">
                    <span className="truncate">{goalLabel(g)}</span>
                    <span className="tabular-nums text-xs text-pitch">{g.minute}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* stats */}
        {statRows.length > 0 && (
          <section className="mt-6">
            <h3 className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {t("detail.stats")}
            </h3>
            <div className="space-y-3">
              {statRows.map((m) => {
                const h = d!.stats!.home[m.key] ?? 0;
                const a = d!.stats!.away[m.key] ?? 0;
                const total = h + a;
                const hPct = total > 0 ? (h / total) * 100 : 50;
                const fmt = (v: number) => (m.pct ? `${Math.round(v)}%` : `${v}`);
                return (
                  <div key={m.key}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold tabular-nums">{fmt(h)}</span>
                      <span className="text-muted">{m.label}</span>
                      <span className="font-semibold tabular-nums">{fmt(a)}</span>
                    </div>
                    <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="bg-pitch" style={{ width: `${hPct}%` }} />
                      <div className="bg-sky/70" style={{ width: `${100 - hPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* cards */}
        {cards.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted">
            {cards.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className={`inline-block h-3 w-2 rounded-[2px] ${c.type === "red" ? "bg-ec-red" : "bg-gold"}`} />
                <span className="tabular-nums">{c.minute}</span> {c.player}
              </span>
            ))}
          </div>
        )}

        {/* info grid */}
        <section className="mt-6 grid grid-cols-1 gap-2 text-sm xs:grid-cols-2">
          <InfoCell label={t("detail.attendance")} value={d?.attendance ? d.attendance.toLocaleString(locale) : null} />
          <InfoCell label={t("detail.broadcast")} value={d?.broadcast?.length ? d.broadcast.join(" · ") : null} />
          <div className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 xs:col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-muted">{t("detail.venue")}</p>
            <p className="mt-0.5 truncate font-medium">
              {match.venue} · {match.city}
            </p>
          </div>
        </section>

        {/* recap or not-started note */}
        {d?.recap ? (
          <section className="mt-5">
            <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {t("detail.recap")}
            </h3>
            <p className="text-sm leading-relaxed text-ink/90">{d.recap}</p>
          </section>
        ) : (
          status === "upcoming" && (
            <p className="mt-5 rounded-xl border border-white/8 bg-white/5 px-3 py-3 text-center text-xs text-muted">
              {t("detail.noStats")}
            </p>
          )
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 truncate font-medium">{value}</p>
    </div>
  );
}
