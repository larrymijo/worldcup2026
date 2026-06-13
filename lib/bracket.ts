import { groupOf } from "./groups";

// A self-contained single-elimination bracket for the prediction tool.
//
// The Round of 32 slots use the official 2026 position-based pairings (group
// winners / runners-up). The eight third-place slots are filled by the user's
// chosen wildcards (assigned by group order), and later rounds feed forward as
// a clean bracket tree. Seeding is intentionally simplified for a personal
// prediction — it is not the official third-place allocation table.

export type Round =
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Final";

export const ROUND_ORDER: Round[] = [
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Final",
];

export type Slot =
  | { kind: "pos"; group: string; pos: 1 | 2 }
  | { kind: "third"; index: number }
  | { kind: "winner"; from: number };

export interface SeedMatch {
  id: number;
  round: Round;
  a: Slot;
  b: Slot;
}

const pos = (group: string, p: 1 | 2): Slot => ({ kind: "pos", group, pos: p });
const third = (index: number): Slot => ({ kind: "third", index });
const win = (from: number): Slot => ({ kind: "winner", from });

export const BRACKET: SeedMatch[] = [
  // Round of 32 (ids 1–16) — official position pairings; thirds = wildcards 0–7
  { id: 1, round: "Round of 32", a: pos("A", 2), b: pos("B", 2) },
  { id: 2, round: "Round of 32", a: pos("C", 1), b: pos("F", 2) },
  { id: 3, round: "Round of 32", a: pos("E", 1), b: third(0) },
  { id: 4, round: "Round of 32", a: pos("F", 1), b: pos("C", 2) },
  { id: 5, round: "Round of 32", a: pos("E", 2), b: pos("I", 2) },
  { id: 6, round: "Round of 32", a: pos("I", 1), b: third(1) },
  { id: 7, round: "Round of 32", a: pos("A", 1), b: third(2) },
  { id: 8, round: "Round of 32", a: pos("L", 1), b: third(3) },
  { id: 9, round: "Round of 32", a: pos("G", 1), b: third(4) },
  { id: 10, round: "Round of 32", a: pos("D", 1), b: third(5) },
  { id: 11, round: "Round of 32", a: pos("H", 1), b: pos("J", 2) },
  { id: 12, round: "Round of 32", a: pos("K", 2), b: pos("L", 2) },
  { id: 13, round: "Round of 32", a: pos("B", 1), b: third(6) },
  { id: 14, round: "Round of 32", a: pos("D", 2), b: pos("G", 2) },
  { id: 15, round: "Round of 32", a: pos("J", 1), b: pos("H", 2) },
  { id: 16, round: "Round of 32", a: pos("K", 1), b: third(7) },

  // Round of 16 (ids 17–24)
  { id: 17, round: "Round of 16", a: win(1), b: win(2) },
  { id: 18, round: "Round of 16", a: win(3), b: win(4) },
  { id: 19, round: "Round of 16", a: win(5), b: win(6) },
  { id: 20, round: "Round of 16", a: win(7), b: win(8) },
  { id: 21, round: "Round of 16", a: win(9), b: win(10) },
  { id: 22, round: "Round of 16", a: win(11), b: win(12) },
  { id: 23, round: "Round of 16", a: win(13), b: win(14) },
  { id: 24, round: "Round of 16", a: win(15), b: win(16) },

  // Quarter-finals (ids 25–28)
  { id: 25, round: "Quarter-final", a: win(17), b: win(18) },
  { id: 26, round: "Quarter-final", a: win(19), b: win(20) },
  { id: 27, round: "Quarter-final", a: win(21), b: win(22) },
  { id: 28, round: "Quarter-final", a: win(23), b: win(24) },

  // Semi-finals (ids 29–30)
  { id: 29, round: "Semi-final", a: win(25), b: win(26) },
  { id: 30, round: "Semi-final", a: win(27), b: win(28) },

  // Final (id 31)
  { id: 31, round: "Final", a: win(29), b: win(30) },
];

export const FINAL_ID = 31;

export interface ResolvedMatch {
  id: number;
  round: Round;
  a?: string;
  b?: string;
  winner?: string;
}

export interface PredictionInput {
  /** group letter -> ordered picks [first, second] */
  groupPicks: Record<string, string[]>;
  /** chosen wildcard third-place teams (max 8, one per group) */
  thirds: string[];
  /** match id -> chosen winning team */
  winners: Record<number, string>;
}

/**
 * Resolve every match's participants from the predictions and prune any stored
 * winners that are no longer valid (e.g. an upstream pick changed). Because
 * `BRACKET` is ordered by id and every `winner` slot references a smaller id,
 * a single forward pass resolves the whole tree.
 */
export function resolveBracket(input: PredictionInput): {
  matches: Record<number, ResolvedMatch>;
  cleanedWinners: Record<number, string>;
} {
  const { groupPicks, thirds, winners } = input;
  const firstOf = (g: string) => groupPicks[g]?.[0];
  const secondOf = (g: string) => groupPicks[g]?.[1];
  const orderedThirds = [...thirds].sort((x, y) =>
    (groupOf(x) ?? "").localeCompare(groupOf(y) ?? ""),
  );

  const matches: Record<number, ResolvedMatch> = {};
  const cleaned: Record<number, string> = {};

  const teamOf = (s: Slot): string | undefined => {
    if (s.kind === "pos") return s.pos === 1 ? firstOf(s.group) : secondOf(s.group);
    if (s.kind === "third") return orderedThirds[s.index];
    return cleaned[s.from]; // winner of an already-resolved earlier match
  };

  for (const m of BRACKET) {
    const a = teamOf(m.a);
    const b = teamOf(m.b);
    let w: string | undefined = winners[m.id];
    if (!a || !b || (w !== a && w !== b)) w = undefined;
    if (w) cleaned[m.id] = w;
    matches[m.id] = { id: m.id, round: m.round, a, b, winner: w };
  }

  return { matches, cleanedWinners: cleaned };
}
