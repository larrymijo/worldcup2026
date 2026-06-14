import type { Match, MatchDetail, MatchEvent, TeamStats } from "./types";

// Live scores.
//
// Primary source: ESPN's public soccer scoreboard for the FIFA World Cup
// (`fifa.world`). It's keyless, free, and returns real scores, status and the
// live minute. If it ever fails, we fall back to a deterministic time-based
// engine so the UI still works. Set SCORES_MODE=simulate to force the engine,
// or SCORES_MODE=off to show the schedule with no scores.

/* --------------------------- built-in engine --------------------------- */

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Goal {
  minute: number;
  side: "home" | "away";
}

function goalScript(id: number): Goal[] {
  const rnd = mulberry32((id * 2654435761) >>> 0);
  const total = Math.floor(rnd() * rnd() * 6);
  const goals: Goal[] = [];
  for (let i = 0; i < total; i++) {
    goals.push({ minute: 1 + Math.floor(rnd() * 90), side: rnd() < 0.5 ? "home" : "away" });
  }
  return goals.sort((a, b) => a.minute - b.minute);
}

const FIRST_HALF = 45;
const BREAK = 15;
const SECOND_HALF = 45;
const LIVE_WINDOW = FIRST_HALF + BREAK + SECOND_HALF;

function timing(elapsed: number): { displayMinute: number; label: string; live: boolean } {
  if (elapsed < FIRST_HALF) {
    const m = Math.min(45, Math.floor(elapsed) + 1);
    return { displayMinute: m, label: `${m}'`, live: true };
  }
  if (elapsed < FIRST_HALF + BREAK) return { displayMinute: 45, label: "HT", live: true };
  if (elapsed < LIVE_WINDOW) {
    const m = Math.min(90, 45 + Math.floor(elapsed - FIRST_HALF - BREAK) + 1);
    return { displayMinute: m, label: `${m}'`, live: true };
  }
  return { displayMinute: 90, label: "FT", live: false };
}

/** Deterministic, time-based fallback when the live feed is unavailable. */
export function simulateLive(matches: Match[], nowMs: number): Match[] {
  return matches.map((m) => {
    if (m.homePlaceholder || m.awayPlaceholder) return m;
    const start = new Date(m.kickoff).getTime();
    const elapsed = (nowMs - start) / 60000;
    if (elapsed < 0) return { ...m, status: "upcoming" as const };

    const goals = goalScript(m.id);
    const t = timing(elapsed);
    const home = goals.filter((g) => g.side === "home" && g.minute <= t.displayMinute).length;
    const away = goals.filter((g) => g.side === "away" && g.minute <= t.displayMinute).length;

    return t.live
      ? { ...m, status: "live" as const, minute: t.label, score: { home, away } }
      : { ...m, status: "finished" as const, minute: undefined, score: { home, away } };
  });
}

/* ------------------------------ ESPN feed ------------------------------ */

const ESPN =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
// Split the tournament so each request stays well under ESPN's event cap.
const RANGES = ["20260611-20260628", "20260629-20260720"];

// Normalise team names so ESPN's names line up with our keys.
const ALIASES: Record<string, string> = {
  usa: "unitedstates",
  korearepublic: "southkorea",
  republicofkorea: "southkorea",
  czechrepublic: "czechia",
  turkey: "turkiye",
  congodr: "drcongo",
  cotedivoire: "ivorycoast",
  capeverdeislands: "capeverde",
};

function norm(s: string): string {
  const k = s.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");
  return ALIASES[k] ?? k;
}

const dateKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

interface FeedEntry {
  status: "live" | "finished" | "upcoming";
  score?: { home: number; away: number };
  minute?: string;
  homeCrest?: string;
  awayCrest?: string;
  detail?: MatchDetail;
}

interface EspnCompetitor {
  id?: string;
  homeAway?: string;
  score?: string;
  form?: string;
  team?: { id?: string; displayName?: string; logo?: string };
  statistics?: { name?: string; displayValue?: string }[];
}

interface EspnDetail {
  clock?: { displayValue?: string };
  team?: { id?: string };
  scoringPlay?: boolean;
  redCard?: boolean;
  yellowCard?: boolean;
  penaltyKick?: boolean;
  ownGoal?: boolean;
  shootout?: boolean;
  athletesInvolved?: { displayName?: string; shortName?: string }[];
}

interface EspnScoreboard {
  events?: {
    date: string;
    headlines?: { description?: string; shortLinkText?: string }[];
    competitions?: {
      attendance?: number;
      broadcasts?: { names?: string[] }[];
      status?: { displayClock?: string; type?: { state?: string; shortDetail?: string } };
      competitors?: EspnCompetitor[];
      details?: EspnDetail[];
    }[];
  }[];
}

const STAT_KEYS: Record<string, keyof TeamStats> = {
  possessionPct: "possession",
  totalShots: "shots",
  shotsOnTarget: "shotsOnTarget",
  foulsCommitted: "fouls",
  wonCorners: "corners",
};

function parseStats(stats?: EspnCompetitor["statistics"]): TeamStats {
  const out: TeamStats = {};
  for (const s of stats ?? []) {
    const key = s.name ? STAT_KEYS[s.name] : undefined;
    const value = Number(s.displayValue);
    if (key && !Number.isNaN(value)) out[key] = value;
  }
  return out;
}

function parseEvents(details: EspnDetail[] | undefined, homeId?: string, awayId?: string): MatchEvent[] {
  const out: MatchEvent[] = [];
  for (const d of details ?? []) {
    const side = d.team?.id && d.team.id === homeId ? "home" : d.team?.id === awayId ? "away" : null;
    if (!side) continue;
    const minute = d.clock?.displayValue ?? "";
    const player = d.athletesInvolved?.[0]?.shortName ?? d.athletesInvolved?.[0]?.displayName ?? "";
    if (d.scoringPlay && !d.shootout) {
      out.push({ minute, type: "goal", side, player, penalty: d.penaltyKick || undefined, ownGoal: d.ownGoal || undefined });
    } else if (d.redCard) {
      out.push({ minute, type: "red", side, player });
    } else if (d.yellowCard) {
      out.push({ minute, type: "yellow", side, player });
    }
  }
  return out;
}

/** Fetch real scores from ESPN. Keyed by `YYYY-MM-DD|homeNorm|awayNorm`. */
export async function fetchEspnScores(): Promise<Map<string, FeedEntry>> {
  const boards = await Promise.all(
    RANGES.map(async (range) => {
      const res = await fetch(`${ESPN}?dates=${range}`, {
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 30 }, // cache upstream ~30s; client polls every 25s
      });
      if (!res.ok) throw new Error(`ESPN ${res.status}`);
      return (await res.json()) as EspnScoreboard;
    }),
  );

  // Two lookups: exact (date + pair) and a pair-only fallback. Each ordered
  // team pair is unique across the tournament, so the fallback safely handles
  // any date discrepancy between ESPN and our schedule (e.g. the opener).
  const map = new Map<string, FeedEntry>();
  for (const board of boards) {
    for (const ev of board.events ?? []) {
      const comp = ev.competitions?.[0];
      const home = comp?.competitors?.find((c) => c.homeAway === "home");
      const away = comp?.competitors?.find((c) => c.homeAway === "away");
      if (!comp || !home || !away) continue;

      const state = comp.status?.type?.state; // "pre" | "in" | "post"
      const shortDetail = comp.status?.type?.shortDetail ?? "";
      const score = { home: Number(home.score ?? 0), away: Number(away.score ?? 0) };

      // Rich detail: stats (live/finished only), scorers, attendance, recap, TV.
      const events = parseEvents(comp.details, home.team?.id, away.team?.id);
      const broadcast = [
        ...new Set((comp.broadcasts ?? []).flatMap((b) => b.names ?? []).filter(Boolean)),
      ];
      const detail: MatchDetail = {};
      if (comp.attendance && comp.attendance > 0) detail.attendance = comp.attendance;
      const recap = ev.headlines?.[0]?.description ?? ev.headlines?.[0]?.shortLinkText;
      if (recap) detail.recap = recap;
      if (broadcast.length) detail.broadcast = broadcast;
      if (events.length) detail.events = events;
      if (home.form || away.form) detail.form = { home: home.form, away: away.form };
      if (state !== "pre") detail.stats = { home: parseStats(home.statistics), away: parseStats(away.statistics) };

      const base: FeedEntry = {
        status: "upcoming",
        homeCrest: home.team?.logo,
        awayCrest: away.team?.logo,
        detail: Object.keys(detail).length ? detail : undefined,
      };
      let entry: FeedEntry;
      if (state === "post") {
        entry = { ...base, status: "finished", score };
      } else if (state === "in") {
        entry = {
          ...base,
          status: "live",
          score,
          minute: /half|^ht$/i.test(shortDetail) ? "HT" : comp.status?.displayClock || shortDetail || undefined,
        };
      } else {
        entry = base;
      }

      const pair = `${norm(home.team?.displayName ?? "")}|${norm(away.team?.displayName ?? "")}`;
      map.set(`${dateKey(ev.date)}|${pair}`, entry);
      map.set(pair, entry);
    }
  }
  return map;
}

/** Merge a feed onto the schedule, falling back to schedule values. */
export function mergeExternal(matches: Match[], feed: Map<string, FeedEntry>): Match[] {
  return matches.map((m) => {
    if (m.homePlaceholder || m.awayPlaceholder) return m;
    const pair = `${norm(m.home)}|${norm(m.away)}`;
    const hit = feed.get(`${dateKey(m.kickoff)}|${pair}`) ?? feed.get(pair);
    if (!hit) return m;
    return {
      ...m,
      status: hit.status,
      minute: hit.minute,
      homeCrest: hit.homeCrest,
      awayCrest: hit.awayCrest,
      detail: hit.detail,
      ...(hit.score ? { score: hit.score } : {}),
    };
  });
}
