import type { Match, MatchStatus } from "./types";

// All formatting uses the visitor's own locale + timezone (the `undefined`
// locale arg tells Intl to use the browser default). A football match is
// treated as "live" for 2 hours after kick-off.

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

/** The visitor's IANA timezone, e.g. "America/Guayaquil". */
export function getLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/** "7:00 PM" style local kick-off time, with timezone abbreviation. */
export function formatLocalTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

/** "Sun, Jun 14" style local date. */
export function formatLocalDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

/** "Sunday, June 14, 2026" — used for date section headers. */
export function formatLocalDateLong(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

/** A stable key (YYYY-MM-DD in the visitor's timezone) for grouping by day. */
export function localDateKey(iso: string): string {
  // en-CA formats as YYYY-MM-DD, which sorts naturally.
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function getMatchStatus(iso: string, now: number = Date.now()): MatchStatus {
  const start = new Date(iso).getTime();
  if (now < start) return "upcoming";
  if (now < start + MATCH_DURATION_MS) return "live";
  return "finished";
}

/** Group matches by local day, preserving chronological order. */
export function groupByLocalDate(matches: Match[]): { key: string; iso: string; matches: Match[] }[] {
  const groups = new Map<string, { key: string; iso: string; matches: Match[] }>();
  for (const m of matches) {
    const key = localDateKey(m.kickoff);
    if (!groups.has(key)) groups.set(key, { key, iso: m.kickoff, matches: [] });
    groups.get(key)!.matches.push(m);
  }
  return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/** Milliseconds until kick-off (negative once started). */
export function msUntil(iso: string, now: number = Date.now()): number {
  return new Date(iso).getTime() - now;
}

/** Short "in 1d 11h" / "in 3h 20m" / "in 12m" relative string for upcoming matches. */
export function formatRelative(ms: number): string {
  if (ms <= 0) return "now";
  const { days, hours, minutes } = countdownParts(ms);
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
}

/** Break a millisecond duration into d/h/m/s parts. */
export function countdownParts(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}
