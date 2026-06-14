// Core domain types for the FIFA World Cup 2026 app.

export type Stage =
  | "Group"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Third-place"
  | "Final";

export type HostCountry = "USA" | "Canada" | "Mexico";

export interface Match {
  /** FIFA match number, 1-104. */
  id: number;
  /** Kick-off time in UTC (ISO 8601). Converted to the visitor's local time in the UI. */
  kickoff: string;
  stage: Stage;
  /** Group letter A–L (group stage only). */
  group?: string;
  /** Home team key (see lib/teams.ts) or a placeholder label for knockout slots. */
  home: string;
  away: string;
  /** True when the "team" is an unresolved knockout slot (e.g. "Winner Group A"). */
  homePlaceholder?: boolean;
  awayPlaceholder?: boolean;
  /** Stadium name. */
  venue: string;
  /** Host city. */
  city: string;
  country: HostCountry;
  /** Live/final score, when known. `null`/undefined means not played yet. */
  score?: { home: number; away: number } | null;
  /** Live status (set by the scores feed). Falls back to a time-based guess. */
  status?: MatchStatus;
  /** Live minute label while in progress, e.g. "67'" or "HT". */
  minute?: string;
  /** Team badge/crest image URLs (from the live feed). */
  homeCrest?: string;
  awayCrest?: string;
  /** Rich match info from the feed (stats, scorers, attendance, recap…). */
  detail?: MatchDetail;
}

export type MatchStatus = "upcoming" | "live" | "finished";

/** A goal or card event in a match timeline. */
export interface MatchEvent {
  /** Minute label, e.g. "27'" or "90'+6'". */
  minute: string;
  type: "goal" | "yellow" | "red";
  side: "home" | "away";
  /** Player short name, e.g. "N. Irankunda". */
  player: string;
  penalty?: boolean;
  ownGoal?: boolean;
}

/** Per-team match statistics. */
export interface TeamStats {
  possession?: number;
  shots?: number;
  shotsOnTarget?: number;
  fouls?: number;
  corners?: number;
}

/** Extra match information surfaced in the detail view. */
export interface MatchDetail {
  attendance?: number;
  /** Editorial recap headline/summary. */
  recap?: string;
  /** Broadcast networks, e.g. ["FS1", "Peacock"]. */
  broadcast?: string[];
  /** Goal + card timeline. */
  events?: MatchEvent[];
  stats?: { home: TeamStats; away: TeamStats };
  /** Recent form string per side, e.g. "WDLWW". */
  form?: { home?: string; away?: string };
}
