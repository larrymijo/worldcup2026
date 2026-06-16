"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GROUP_LETTERS, GROUPS, type GroupLetter } from "@/lib/groups";
import {
  BRACKET,
  FINAL_ID,
  ROUND_ORDER,
  resolveBracketScores,
  type KoScore,
  type ResolvedKoMatch,
  type Round,
} from "@/lib/bracket";
import { MATCHES } from "@/lib/matches";
import { rankThirds, tableFromMatches, type StandingRow } from "@/lib/standings";
import type { Match } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import { stageLabel } from "@/lib/i18n";
import { TeamFlag } from "./TeamFlag";
import { StandingsTable } from "./StandingsTable";
import { OrganiskBadge } from "./Sponsor";
import { useI18n } from "./I18nProvider";

const STORAGE_KEY = "wc2026-prediction-v2";
const name = (t?: string) => (t ? TEAMS[t]?.name ?? t : "—");
const clamp = (n: number) => Math.max(0, Math.min(20, n));
const rndGoals = () => Math.floor(Math.random() * Math.random() * 4); // low-biased 0–3

interface Saved {
  gScores: Record<number, KoScore>;
  koScores: Record<number, KoScore>;
  koPens: Record<number, "a" | "b">;
}

export function Predictor() {
  const { t } = useI18n();
  const [gScores, setGScores] = useState<Record<number, KoScore>>({});
  const [koScores, setKoScores] = useState<Record<number, KoScore>>({});
  const [koPens, setKoPens] = useState<Record<number, "a" | "b">>({});
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        setGScores(s.gScores ?? {});
        setKoScores(s.koScores ?? {});
        setKoPens(s.koPens ?? {});
      }
    } catch {
      /* ignore corrupt storage */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ gScores, koScores, koPens }));
    } catch {
      /* ignore quota errors */
    }
  }, [gScores, koScores, koPens]);

  const groupFixtures = useMemo(() => {
    const map: Record<string, Match[]> = {};
    for (const g of GROUP_LETTERS) map[g] = [];
    for (const m of MATCHES) if (m.stage === "Group" && m.group) map[m.group].push(m);
    return map;
  }, []);

  const tablesByGroup = useMemo(() => {
    const out: Record<string, StandingRow[]> = {};
    for (const g of GROUP_LETTERS) {
      const fx = groupFixtures[g].map((m) => ({
        home: m.home,
        away: m.away,
        score: gScores[m.id] ? { home: gScores[m.id].h, away: gScores[m.id].a } : null,
      }));
      out[g] = tableFromMatches(GROUPS[g], fx, g);
    }
    return out;
  }, [gScores, groupFixtures]);

  const groupComplete = (g: string) => groupFixtures[g].every((m) => gScores[m.id]);
  const completeCount = GROUP_LETTERS.filter(groupComplete).length;
  const allComplete = completeCount === 12;

  const groupPicks = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const g of GROUP_LETTERS) out[g] = [tablesByGroup[g][0].team, tablesByGroup[g][1].team];
    return out;
  }, [tablesByGroup]);

  const thirdsRanked = useMemo(() => rankThirds(tablesByGroup), [tablesByGroup]);
  const best8 = useMemo(() => thirdsRanked.slice(0, 8).map((r) => r.team), [thirdsRanked]);

  const ko = useMemo(
    () => resolveBracketScores({ groupPicks, thirds: best8, koScores, koPens }).matches,
    [groupPicks, best8, koScores, koPens],
  );
  const champion = ko[FINAL_ID]?.winner;

  /* ---- mutations ---- */
  const bumpG = (id: number, side: "h" | "a", d: number) =>
    setGScores((p) => {
      const cur = p[id] ?? { h: 0, a: 0 };
      return { ...p, [id]: side === "h" ? { h: clamp(cur.h + d), a: cur.a } : { h: cur.h, a: clamp(cur.a + d) } };
    });
  const bumpKo = (id: number, side: "h" | "a", d: number) =>
    setKoScores((p) => {
      const cur = p[id] ?? { h: 0, a: 0 };
      return { ...p, [id]: side === "h" ? { h: clamp(cur.h + d), a: cur.a } : { h: cur.h, a: clamp(cur.a + d) } };
    });
  const setPen = (id: number, side: "a" | "b") => setKoPens((p) => ({ ...p, [id]: side }));

  function fillEmptyGroups() {
    setGScores((p) => {
      const next = { ...p };
      for (const g of GROUP_LETTERS)
        for (const m of groupFixtures[g]) if (!next[m.id]) next[m.id] = { h: rndGoals(), a: rndGoals() };
      return next;
    });
  }

  function reset() {
    setGScores({});
    setKoScores({});
    setKoPens({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 sm:pt-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 -top-16 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            🔮 {t("pr.badge")}
          </span>
          <h1 className="mt-4 font-display text-[2.4rem] font-bold leading-[1.05] xs:text-5xl sm:text-6xl">
            {t("pr.titlePre")}
            <span className="text-gradient">{t("pr.titleHl")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{t("pr.subtitle")}</p>
          <div className="mt-6">
            <OrganiskBadge labelKey="sponsor.presentedBy" size="lg" />
          </div>
        </div>
      </section>

      {/* Progress */}
      <div className="glass z-30 mt-6 mb-8 flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2.5 text-xs sm:sticky sm:top-16 sm:gap-3 sm:px-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-semibold ${
            allComplete ? "border-pitch/40 bg-pitch/10 text-pitch" : "border-white/10 bg-white/5 text-muted"
          }`}
        >
          <span className="uppercase tracking-wider text-[10px] opacity-80">{t("pr.groups")}</span>
          <span className="tabular-nums">{completeCount}/12</span>
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-semibold ${
            champion ? "border-gold/40 bg-gold/10 text-gold" : "border-white/10 bg-white/5 text-muted"
          }`}
        >
          {champion && <TeamFlag team={champion} size={18} />}
          <span className="uppercase tracking-wider text-[10px] opacity-80">{t("pr.champion")}</span>
          <span className="tabular-nums">{champion ? name(champion) : "—"}</span>
        </span>
        <button
          onClick={fillEmptyGroups}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-muted transition hover:border-violet/40 hover:text-violet"
        >
          🎲 {t("pr.fillEmpty")}
        </button>
        <button
          onClick={reset}
          className="ml-auto rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-muted transition hover:border-ec-red/40 hover:text-red-300"
        >
          {t("pr.reset")}
        </button>
      </div>

      {champion && <ChampionBanner team={champion} />}

      {/* Step 1 — Group scores */}
      <StepHeader n={1} title={t("pr.step1")} hint={t("pr.step1hint")} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {GROUP_LETTERS.map((g) => (
          <GroupCard
            key={g}
            letter={g}
            fixtures={groupFixtures[g]}
            table={tablesByGroup[g]}
            scores={gScores}
            onBump={bumpG}
            complete={groupComplete(g)}
          />
        ))}
      </div>

      {/* Best thirds */}
      <StepHeader n={2} title={t("pr.bestThirds")} hint={t("pr.bestThirdsHint")} />
      <div className="flex flex-wrap gap-2">
        {thirdsRanked.slice(0, 8).map((r, i) => (
          <span
            key={r.team}
            className="inline-flex items-center gap-2 rounded-full border border-pitch/30 bg-pitch/10 px-3 py-1.5 text-sm"
          >
            <span className="text-[10px] font-bold text-pitch">{i + 1}</span>
            <TeamFlag team={r.team} size={18} />
            <span className="font-medium text-ink">{name(r.team)}</span>
            <span className="text-[11px] text-muted">{t("stage.group")} {r.group}</span>
          </span>
        ))}
      </div>

      {/* Step 3 — Bracket */}
      <StepHeader n={3} title={t("pr.step3")} hint={t("pr.step3hint")} />
      {allComplete ? (
        <BracketView matches={ko} onBump={bumpKo} onPen={setPen} />
      ) : (
        <LockedBracket completeCount={completeCount} onFill={fillEmptyGroups} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StepHeader({ n, title, hint }: { n: number; title: string; hint: string }) {
  return (
    <div className="mb-4 mt-12 scroll-mt-28">
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-pitch-grad text-sm font-bold text-night">{n}</span>
        <h2 className="font-display text-lg font-semibold tracking-wide text-ink">{title}</h2>
        <div className="hairline flex-1" />
      </div>
      <p className="mt-2 pl-10 text-xs text-muted">{hint}</p>
    </div>
  );
}

function ChevUp() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path d="m6 15 6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevDown() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner({
  value,
  onUp,
  onDown,
  disabled,
}: {
  value?: number;
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex select-none flex-col items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={onUp}
        className="grid h-6 w-9 touch-manipulation place-items-center rounded text-muted transition hover:text-pitch active:bg-white/5 disabled:opacity-25"
        aria-label="+1"
      >
        <ChevUp />
      </button>
      <span className="w-7 text-center font-display text-lg font-bold tabular-nums text-ink">{value ?? "–"}</span>
      <button
        type="button"
        disabled={disabled}
        onClick={onDown}
        className="grid h-6 w-9 touch-manipulation place-items-center rounded text-muted transition hover:text-pitch active:bg-white/5 disabled:opacity-25"
        aria-label="-1"
      >
        <ChevDown />
      </button>
    </div>
  );
}

function GroupCard({
  letter,
  fixtures,
  table,
  scores,
  onBump,
  complete,
}: {
  letter: GroupLetter;
  fixtures: Match[];
  table: StandingRow[];
  scores: Record<number, KoScore>;
  onBump: (id: number, side: "h" | "a", d: number) => void;
  complete: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className={`glass rounded-2xl p-3 sm:p-4 ${complete ? "ring-1 ring-pitch/30" : ""}`}>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-pitch-grad text-xs font-bold text-night">
            {letter}
          </span>
          <span className="font-display text-sm font-bold tracking-wide text-ink">
            {t("stage.group")} {letter}
          </span>
        </span>
        {complete && <span className="text-[10px] font-semibold uppercase tracking-wider text-pitch">✓ {t("pr.set")}</span>}
      </div>

      <StandingsTable rows={table} qualify={2} highlightThird />

      <div className="mt-3 border-t border-white/5 pt-2">
        <div className="space-y-0.5">
          {fixtures.map((m) => (
            <div key={m.id} className="flex items-center gap-1.5 rounded-lg px-1 py-0.5">
              <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-right">
                <span className="truncate text-xs font-medium text-ink">{name(m.home)}</span>
                <TeamFlag team={m.home} size={18} />
              </div>
              <div className="flex shrink-0 items-center">
                <Spinner value={scores[m.id]?.h} onUp={() => onBump(m.id, "h", 1)} onDown={() => onBump(m.id, "h", -1)} />
                <span className="px-0.5 text-muted">:</span>
                <Spinner value={scores[m.id]?.a} onUp={() => onBump(m.id, "a", 1)} onDown={() => onBump(m.id, "a", -1)} />
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <TeamFlag team={m.away} size={18} />
                <span className="truncate text-xs font-medium text-ink">{name(m.away)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LockedBracket({ completeCount, onFill }: { completeCount: number; onFill: () => void }) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
      <div className="text-3xl">🔒</div>
      <p className="mt-3 font-display text-lg text-ink">{t("pr.locked")}</p>
      <p className="mt-1 text-sm text-muted">{t("pr.bracketLockedScores")}</p>
      <div className="mt-4 flex flex-col items-center gap-3">
        <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-muted">
          {t("pr.groups")} {completeCount}/12
        </span>
        <button
          onClick={onFill}
          className="rounded-xl border border-violet/40 bg-violet/15 px-4 py-2 text-sm font-semibold text-violet transition hover:bg-violet/25"
        >
          🎲 {t("pr.fillEmpty")}
        </button>
      </div>
    </div>
  );
}

function BracketView({
  matches,
  onBump,
  onPen,
}: {
  matches: Record<number, ResolvedKoMatch>;
  onBump: (id: number, side: "h" | "a", d: number) => void;
  onPen: (id: number, side: "a" | "b") => void;
}) {
  const { t } = useI18n();
  const byRound = (r: Round) => BRACKET.filter((m) => m.round === r).map((m) => matches[m.id]);
  return (
    <div>
      <p className="mb-3 text-xs text-muted sm:hidden">{t("pr.swipe")}</p>
      <div className="flex items-stretch gap-3 overflow-x-auto pb-4 sm:gap-5">
        {ROUND_ORDER.map((round) => (
          <div key={round} className="flex min-w-[250px] flex-col sm:min-w-[270px]">
            <div className="mb-3 rounded-lg bg-white/5 px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
              {stageLabel(t, round)}
            </div>
            <div className="flex flex-1 flex-col justify-around gap-3">
              {byRound(round).map((m) => (
                <KoCard key={m.id} match={m} onBump={onBump} onPen={onPen} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KoCard({
  match,
  onBump,
  onPen,
}: {
  match: ResolvedKoMatch;
  onBump: (id: number, side: "h" | "a", d: number) => void;
  onPen: (id: number, side: "a" | "b") => void;
}) {
  const { t } = useI18n();
  const isFinal = match.round === "Final";
  const ready = !!match.a && !!match.b;
  const level = ready && !!match.score && match.score.h === match.score.a;

  return (
    <div className={`overflow-hidden rounded-xl border ${isFinal ? "border-gold/40" : "border-white/10"} bg-card/80`}>
      <KoLine
        team={match.a}
        value={match.score?.h}
        winner={match.winner === match.a && !!match.a}
        onUp={() => onBump(match.id, "h", 1)}
        onDown={() => onBump(match.id, "h", -1)}
      />
      <div className="h-px bg-white/10" />
      <KoLine
        team={match.b}
        value={match.score?.a}
        winner={match.winner === match.b && !!match.b}
        onUp={() => onBump(match.id, "a", 1)}
        onDown={() => onBump(match.id, "a", -1)}
      />
      {level && (
        <div className="flex items-center gap-1.5 border-t border-white/10 bg-white/[0.03] px-2 py-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted">{t("pr.pens")}</span>
          {(["a", "b"] as const).map((side) => {
            const team = side === "a" ? match.a : match.b;
            const active = match.pen === side;
            return (
              <button
                key={side}
                onClick={() => onPen(match.id, side)}
                className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold transition ${
                  active ? "border-gold/50 bg-gold/15 text-gold" : "border-white/10 text-muted hover:text-ink"
                }`}
              >
                <TeamFlag team={team!} size={14} />
                {name(team).slice(0, 3).toUpperCase()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KoLine({
  team,
  value,
  winner,
  onUp,
  onDown,
}: {
  team?: string;
  value?: number;
  winner: boolean;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 transition ${winner ? "bg-pitch/15" : ""}`}>
      {team ? (
        <TeamFlag team={team} size={20} />
      ) : (
        <span className="h-[15px] w-[20px] rounded-sm border border-dashed border-white/15" />
      )}
      <span className={`flex-1 truncate text-sm ${winner ? "font-bold text-ink" : team ? "text-ink/90" : "text-muted/50"}`}>
        {name(team)}
      </span>
      <Spinner value={value} onUp={onUp} onDown={onDown} disabled={!team} />
    </div>
  );
}

function ChampionBanner({ team }: { team: string }) {
  const { t } = useI18n();
  return (
    <div className="animate-in relative mb-8 overflow-hidden rounded-3xl border border-gold/40 p-6 text-center sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-violet/15" />
      <div className="relative">
        <div className="text-3xl">🏆</div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t("pr.yourChampion")}</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <TeamFlag team={team} size={64} />
          <span className="font-display text-3xl font-bold text-ink sm:text-4xl">{name(team)}</span>
        </div>
        <div className="mt-5 flex justify-center">
          <OrganiskBadge labelKey="sponsor.championBy" />
        </div>
      </div>
    </div>
  );
}
