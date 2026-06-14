"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";

export type ScoreSource = "live-feed" | "simulated" | "off";

interface State {
  matches: Match[];
  loading: boolean;
  error: string | null;
  source: ScoreSource | null;
}

/**
 * Fetches the fixture list from /api/matches and re-polls every `pollMs` so
 * live scores and minutes stay current. Existing data is kept across polls
 * (no loading flash after the first load).
 */
export function useMatches(pollMs = 25_000): State {
  const [state, setState] = useState<State>({
    matches: [],
    loading: true,
    error: null,
    source: null,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch("/api/matches", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data: { matches: Match[]; source: ScoreSource } = await res.json();
        if (active) setState({ matches: data.matches, loading: false, error: null, source: data.source });
      } catch (err) {
        // Keep any previously loaded data; only surface an error on first load.
        if (active)
          setState((prev) => ({
            matches: prev.matches,
            loading: false,
            error: prev.matches.length ? null : err instanceof Error ? err.message : "Failed to load matches",
            source: prev.source,
          }));
      }
    };

    load();
    const id = setInterval(load, pollMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return state;
}

/** A clock that re-renders on an interval so statuses/countdowns stay fresh. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
