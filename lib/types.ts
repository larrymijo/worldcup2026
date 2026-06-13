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
  /** Final score, when known. `null`/undefined means not played yet. */
  score?: { home: number; away: number } | null;
}

export type MatchStatus = "upcoming" | "live" | "finished";
