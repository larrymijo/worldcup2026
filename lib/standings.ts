import type { Match } from "./types";

// Shared league-table / leaderboard maths, used by both the live Groups page
// (real scores) and the prediction tool (user-entered scores).

export interface StandingRow {
  team: string;
  played: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  /** Group letter (set when ranking third-placed teams across groups). */
  group?: string;
}

/** A minimal scored fixture — `Match` satisfies this. */
export interface ScoredFixture {
  home: string;
  away: string;
  score?: { home: number; away: number } | null;
}

const empty = (team: string, group?: string): StandingRow => ({
  team, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, group,
});

/** Sort by points, goal difference, goals for, then the seeded order. */
function compare(seed: string[]) {
  return (x: StandingRow, y: StandingRow) =>
    y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || seed.indexOf(x.team) - seed.indexOf(y.team);
}

/** Build a sorted group table from any fixtures that carry a score. */
export function tableFromMatches(teams: string[], fixtures: ScoredFixture[], group?: string): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const t of teams) rows.set(t, empty(t, group));

  for (const m of fixtures) {
    if (!m.score) continue;
    const h = rows.get(m.home);
    const a = rows.get(m.away);
    if (!h || !a) continue;
    const { home: hs, away: as } = m.score;
    h.played++; a.played++;
    h.gf += hs; h.ga += as; a.gf += as; a.ga += hs;
    if (hs > as) { h.w++; a.l++; h.pts += 3; }
    else if (hs < as) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }
  for (const r of rows.values()) r.gd = r.gf - r.ga;
  return [...rows.values()].sort(compare(teams));
}

/** Rank every group's third-placed team (best first). */
export function rankThirds(tablesByGroup: Record<string, StandingRow[]>): StandingRow[] {
  const thirds: StandingRow[] = [];
  for (const g of Object.keys(tablesByGroup)) {
    const third = tablesByGroup[g][2];
    if (third) thirds.push({ ...third, group: g });
  }
  return thirds.sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
}

export interface Scorer {
  player: string;
  team: string;
  goals: number;
  penalties: number;
}

/** Aggregate goal scorers across matches (own goals excluded). */
export function topScorers(matches: Match[]): Scorer[] {
  const map = new Map<string, Scorer>();
  for (const m of matches) {
    for (const e of m.detail?.events ?? []) {
      if (e.type !== "goal" || e.ownGoal || !e.player) continue;
      const team = e.side === "home" ? m.home : m.away;
      const key = `${e.player}|${team}`;
      const s = map.get(key) ?? { player: e.player, team, goals: 0, penalties: 0 };
      s.goals++;
      if (e.penalty) s.penalties++;
      map.set(key, s);
    }
  }
  return [...map.values()].sort((a, b) => b.goals - a.goals || a.player.localeCompare(b.player));
}

export interface TournamentStats {
  played: number;
  goals: number;
  avg: number;
  attendance: number;
  cards: number;
  cleanSheets: number;
  biggest?: { match: Match; gd: number };
}

/** Headline tournament numbers from the finished matches. */
export function tournamentStats(matches: Match[]): TournamentStats {
  let played = 0, goals = 0, attendance = 0, cards = 0, cleanSheets = 0;
  let biggest: { match: Match; gd: number } | undefined;
  for (const m of matches) {
    if (!m.score) continue;
    played++;
    const { home, away } = m.score;
    goals += home + away;
    attendance += m.detail?.attendance ?? 0;
    cards += (m.detail?.events ?? []).filter((e) => e.type !== "goal").length;
    if (home === 0) cleanSheets++;
    if (away === 0) cleanSheets++;
    const gd = Math.abs(home - away);
    if (!biggest || gd > biggest.gd) biggest = { match: m, gd };
  }
  return {
    played,
    goals,
    avg: played ? goals / played : 0,
    attendance,
    cards,
    cleanSheets,
    biggest,
  };
}
