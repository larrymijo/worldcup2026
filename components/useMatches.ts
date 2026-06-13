"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";

interface State {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

/** Fetches the fixture list from the /api/matches route handler. */
export function useMatches(): State {
  const [state, setState] = useState<State>({
    matches: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    fetch("/api/matches")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: { matches: Match[] }) => {
        if (active) setState({ matches: data.matches, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active)
          setState({
            matches: [],
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load matches",
          });
      });
    return () => {
      active = false;
    };
  }, []);

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
