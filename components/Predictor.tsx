"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GROUP_LETTERS, GROUPS, groupOf, type GroupLetter } from "@/lib/groups";
import {
  BRACKET,
  FINAL_ID,
  ROUND_ORDER,
  resolveBracket,
  type ResolvedMatch,
  type Round,
} from "@/lib/bracket";
import { TEAMS } from "@/lib/teams";
import { TeamFlag } from "./TeamFlag";

const STORAGE_KEY = "wc2026-prediction-v1";
const name = (t?: string) => (t ? (TEAMS[t]?.name ?? t) : "—");

interface Saved {
  groupPicks: Record<string, string[]>;
  thirds: string[];
  winners: Record<number, string>;
}

export function Predictor() {
  const [groupPicks, setGroupPicks] = useState<Record<string, string[]>>({});
  const [thirds, setThirds] = useState<string[]>([]);
  const [winners, setWinners] = useState<Record<number, string>>({});
  const loaded = useRef(false);

  // Load saved prediction once on mount.
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1") {
      const gp: Record<string, string[]> = {};
      for (const g of GROUP_LETTERS) gp[g] = [GROUPS[g][0], GROUPS[g][1]];
      const th = GROUP_LETTERS.slice(0, 8).map((g) => GROUPS[g][2]);
      const w: Record<number, string> = {};
      for (const m of BRACKET) {
        const r = resolveBracket({ groupPicks: gp, thirds: th, winners: w }).matches[m.id];
        if (r.a) w[m.id] = r.a;
      }
      for (const id of [2, 17, 25, 29, 31]) w[id] = "Brazil";
      setGroupPicks(gp);
      setThirds(th);
      setWinners(w);
      loaded.current = true;
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        setGroupPicks(s.groupPicks ?? {});
        setThirds(s.thirds ?? []);
        setWinners(s.winners ?? {});
      }
    } catch {
      /* ignore corrupt storage */
    }
    loaded.current = true;
  }, []);

  // Persist after load.
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ groupPicks, thirds, winners }));
    } catch {
      /* ignore quota errors */
    }
  }, [groupPicks, thirds, winners]);

  // Drop wildcard thirds that are no longer valid (group changed / now advancing).
  useEffect(() => {
    const valid = thirds.filter((t) => {
      const g = groupOf(t);
      if (!g) return false;
      const picks = groupPicks[g] ?? [];
      return picks.length === 2 && !picks.includes(t);
    });
    if (valid.length !== thirds.length) setThirds(valid);
  }, [groupPicks, thirds]);

  const resolved = useMemo(
    () => resolveBracket({ groupPicks, thirds, winners }),
    [groupPicks, thirds, winners],
  );

  // Prune knockout winners invalidated by upstream changes.
  useEffect(() => {
    const cleaned = resolved.cleanedWinners;
    if (JSON.stringify(cleaned) !== JSON.stringify(winners)) setWinners(cleaned);
  }, [resolved, winners]);

  const completeGroups = GROUP_LETTERS.filter((g) => (groupPicks[g]?.length ?? 0) === 2);
  const groupsDone = completeGroups.length === 12;
  const thirdsDone = thirds.length === 8;
  const bracketReady = groupsDone && thirdsDone;
  const champion = resolved.matches[FINAL_ID]?.winner;

  function toggleGroupPick(g: GroupLetter, team: string) {
    setGroupPicks((prev) => {
      const cur = prev[g] ? [...prev[g]] : [];
      const idx = cur.indexOf(team);
      if (idx >= 0) cur.splice(idx, 1);
      else if (cur.length < 2) cur.push(team);
      else return prev;
      return { ...prev, [g]: cur };
    });
  }

  function toggleThird(team: string) {
    const g = groupOf(team);
    setThirds((prev) => {
      if (prev.includes(team)) return prev.filter((t) => t !== team);
      const withoutGroup = prev.filter((t) => groupOf(t) !== g);
      if (withoutGroup.length >= 8) return prev;
      return [...withoutGroup, team];
    });
  }

  function pickWinner(id: number, team?: string) {
    if (!team) return;
    setWinners((prev) => ({ ...prev, [id]: team }));
  }

  function reset() {
    setGroupPicks({});
    setThirds([]);
    setWinners({});
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
            🔮 Bracket Challenge
          </span>
          <h1 className="mt-4 font-display text-[2.4rem] font-bold leading-[1.05] xs:text-5xl sm:text-6xl">
            Predict the <span className="text-gradient">bracket</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Call the group winners, pick your wildcard underdogs, then click your
            way through every knockout round to crown a champion. Your picks save
            automatically in this browser.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="glass z-30 mt-6 mb-8 flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2.5 text-xs sm:sticky sm:top-16 sm:gap-3 sm:px-4">
        <ProgressChip label="Groups" value={`${completeGroups.length}/12`} done={groupsDone} href="#step-groups" />
        <ProgressChip label="Wildcards" value={`${thirds.length}/8`} done={thirdsDone} href="#step-wildcards" />
        <ProgressChip
          label="Champion"
          value={champion ? name(champion) : "—"}
          done={!!champion}
          href="#step-bracket"
          flag={champion}
        />
        <button
          onClick={reset}
          className="ml-auto rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-muted transition hover:border-ec-red/40 hover:text-red-300"
        >
          Reset
        </button>
      </div>

      {/* Champion banner */}
      {champion && <ChampionBanner team={champion} />}

      {/* Step 1 — Groups */}
      <StepHeader id="step-groups" n={1} title="Group stage" hint="Tap two teams in each group to set 1st & 2nd place." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GROUP_LETTERS.map((g) => (
          <GroupCard key={g} letter={g} picks={groupPicks[g] ?? []} onToggle={(t) => toggleGroupPick(g, t)} />
        ))}
      </div>

      {/* Step 2 — Wildcards */}
      <StepHeader
        id="step-wildcards"
        n={2}
        title="Wildcard third-place teams"
        hint="Choose 8 of the best third-placed teams (max one per group) to complete the 32."
      />
      <WildcardPicker groupPicks={groupPicks} thirds={thirds} onToggle={toggleThird} />

      {/* Step 3 — Bracket */}
      <StepHeader id="step-bracket" n={3} title="Knockout bracket" hint="Tap the team you think advances in each match — winners flow to the next round." />
      {bracketReady ? (
        <BracketView matches={resolved.matches} onPick={pickWinner} />
      ) : (
        <LockedBracket groupsDone={groupsDone} groupsCount={completeGroups.length} thirdsCount={thirds.length} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ProgressChip({
  label,
  value,
  done,
  href,
  flag,
}: {
  label: string;
  value: string;
  done: boolean;
  href: string;
  flag?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-semibold transition ${
        done
          ? "border-pitch/40 bg-pitch/10 text-pitch"
          : "border-white/10 bg-white/5 text-muted hover:text-ink"
      }`}
    >
      {flag && <TeamFlag team={flag} size={18} />}
      <span className="uppercase tracking-wider text-[10px] opacity-80">{label}</span>
      <span className="tabular-nums">{value}</span>
    </a>
  );
}

function StepHeader({ id, n, title, hint }: { id: string; n: number; title: string; hint: string }) {
  return (
    <div id={id} className="mb-4 mt-12 scroll-mt-28 first:mt-0">
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-pitch-grad text-sm font-bold text-night">
          {n}
        </span>
        <h2 className="font-display text-lg font-semibold tracking-wide text-ink">{title}</h2>
        <div className="hairline flex-1" />
      </div>
      <p className="mt-2 pl-10 text-xs text-muted">{hint}</p>
    </div>
  );
}

function GroupCard({
  letter,
  picks,
  onToggle,
}: {
  letter: GroupLetter;
  picks: string[];
  onToggle: (team: string) => void;
}) {
  const complete = picks.length === 2;
  return (
    <div className={`glass rounded-2xl p-3 ${complete ? "ring-1 ring-pitch/30" : ""}`}>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-display text-sm font-bold tracking-wider text-ink">Group {letter}</span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${complete ? "text-pitch" : "text-muted"}`}>
          {complete ? "✓ set" : `pick ${2 - picks.length} more`}
        </span>
      </div>
      <div className="space-y-1.5">
        {GROUPS[letter].map((team) => {
          const rank = picks.indexOf(team); // -1, 0, or 1
          const selected = rank >= 0;
          return (
            <button
              key={team}
              onClick={() => onToggle(team)}
              className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition ${
                selected
                  ? rank === 0
                    ? "border-gold/50 bg-gold/10"
                    : "border-white/25 bg-white/10"
                  : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
              }`}
            >
              <TeamFlag team={team} size={24} />
              <span className={`flex-1 truncate text-sm ${selected ? "font-semibold text-ink" : "text-muted"}`}>
                {name(team)}
              </span>
              <RankBadge rank={rank} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank < 0)
    return <span className="h-5 w-5 rounded-full border border-dashed border-white/15" />;
  const isFirst = rank === 0;
  return (
    <span
      className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
        isFirst ? "bg-gold text-night" : "bg-white/80 text-night"
      }`}
    >
      {rank + 1}
    </span>
  );
}

function WildcardPicker({
  groupPicks,
  thirds,
  onToggle,
}: {
  groupPicks: Record<string, string[]>;
  thirds: string[];
  onToggle: (team: string) => void;
}) {
  const ready = GROUP_LETTERS.filter((g) => (groupPicks[g]?.length ?? 0) === 2);
  if (ready.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-sm text-muted">
        Set the group winners above first — then the third-place contenders appear here.
      </div>
    );
  }
  const full = thirds.length >= 8;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ready.map((g) => {
        const leftovers = GROUPS[g].filter((t) => !(groupPicks[g] ?? []).includes(t));
        return (
          <div key={g} className="glass rounded-2xl p-3">
            <div className="mb-2 px-1 font-display text-xs font-bold tracking-wider text-muted">
              Group {g} · 3rd place
            </div>
            <div className="flex flex-col gap-1.5">
              {leftovers.map((team) => {
                const selected = thirds.includes(team);
                const disabled = !selected && full;
                return (
                  <button
                    key={team}
                    onClick={() => onToggle(team)}
                    disabled={disabled}
                    className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition ${
                      selected
                        ? "border-violet/50 bg-violet/15"
                        : disabled
                          ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-40"
                          : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
                    }`}
                  >
                    <TeamFlag team={team} size={22} />
                    <span className={`flex-1 truncate text-sm ${selected ? "font-semibold text-ink" : "text-muted"}`}>
                      {name(team)}
                    </span>
                    {selected && <span className="text-violet">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LockedBracket({
  groupsDone,
  groupsCount,
  thirdsCount,
}: {
  groupsDone: boolean;
  groupsCount: number;
  thirdsCount: number;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
      <div className="text-3xl">🔒</div>
      <p className="mt-3 font-display text-lg text-ink">Bracket locked</p>
      <p className="mt-1 text-sm text-muted">
        Finish the setup to unlock the knockout rounds:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        <span className={`rounded-full px-3 py-1.5 ${groupsDone ? "bg-pitch/15 text-pitch" : "bg-white/5 text-muted"}`}>
          {groupsDone ? "✓" : "•"} Groups {groupsCount}/12
        </span>
        <span className={`rounded-full px-3 py-1.5 ${thirdsCount === 8 ? "bg-pitch/15 text-pitch" : "bg-white/5 text-muted"}`}>
          {thirdsCount === 8 ? "✓" : "•"} Wildcards {thirdsCount}/8
        </span>
      </div>
    </div>
  );
}

function BracketView({
  matches,
  onPick,
}: {
  matches: Record<number, ResolvedMatch>;
  onPick: (id: number, team?: string) => void;
}) {
  const byRound = (r: Round) =>
    BRACKET.filter((m) => m.round === r).map((m) => matches[m.id]);

  return (
    <div>
      <p className="mb-3 text-xs text-muted sm:hidden">← swipe to explore the bracket →</p>
      <div className="flex items-stretch gap-3 overflow-x-auto pb-4 sm:gap-5">
        {ROUND_ORDER.map((round) => (
          <div key={round} className="flex min-w-[220px] flex-col sm:min-w-[240px]">
            <div className="mb-3 rounded-lg bg-white/5 px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
              {round}
            </div>
            <div className="flex flex-1 flex-col justify-around gap-3">
              {byRound(round).map((m) => (
                <KnockoutCard key={m.id} match={m} onPick={onPick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnockoutCard({
  match,
  onPick,
}: {
  match: ResolvedMatch;
  onPick: (id: number, team?: string) => void;
}) {
  const isFinal = match.round === "Final";
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        isFinal ? "border-gold/40" : "border-white/10"
      } bg-card/80`}
    >
      <TeamRow match={match} team={match.a} onPick={onPick} />
      <div className="h-px bg-white/10" />
      <TeamRow match={match} team={match.b} onPick={onPick} />
    </div>
  );
}

function TeamRow({
  match,
  team,
  onPick,
}: {
  match: ResolvedMatch;
  team?: string;
  onPick: (id: number, team?: string) => void;
}) {
  const decided = !!match.winner;
  const isWinner = decided && match.winner === team;
  const isLoser = decided && !isWinner;
  const disabled = !team;

  return (
    <button
      onClick={() => onPick(match.id, team)}
      disabled={disabled}
      className={`flex w-full items-center gap-2 px-2.5 py-2 text-left transition ${
        isWinner
          ? "bg-pitch/20"
          : isLoser
            ? "opacity-45 hover:opacity-70"
            : disabled
              ? "cursor-not-allowed"
              : "hover:bg-white/5"
      }`}
    >
      {team ? (
        <TeamFlag team={team} size={22} />
      ) : (
        <span className="h-[16px] w-[22px] rounded-sm border border-dashed border-white/15" />
      )}
      <span
        className={`flex-1 truncate text-sm ${
          isWinner ? "font-bold text-ink" : team ? "text-ink/90" : "text-muted/50"
        }`}
      >
        {name(team)}
      </span>
      {isWinner && <span className="text-xs text-pitch">✓</span>}
    </button>
  );
}

function ChampionBanner({ team }: { team: string }) {
  return (
    <div className="animate-in relative mb-8 overflow-hidden rounded-3xl border border-gold/40 p-6 text-center sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-violet/15" />
      <div className="relative">
        <div className="text-3xl">🏆</div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Your predicted champion
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <TeamFlag team={team} size={64} />
          <span className="font-display text-3xl font-bold text-ink sm:text-4xl">{name(team)}</span>
        </div>
      </div>
    </div>
  );
}
