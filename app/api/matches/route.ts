import { getAllMatches } from "@/lib/matches";
import { fetchEspnScores, mergeExternal, simulateLive } from "@/lib/live";

// World Cup 2026 fixtures + live scores. Recomputed per request so scores and
// the live minute stay fresh; the client polls this endpoint on an interval.
//
// Score source (env SCORES_MODE):
//   - default     -> real live scores from ESPN's public feed (keyless)
//   - "simulate"  -> built-in deterministic engine
//   - "off"       -> schedule only, no scores
// On any feed error the route falls back to the built-in engine.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Source = "live-feed" | "simulated" | "off";

export async function GET() {
  const now = Date.now();
  const mode = process.env.SCORES_MODE;
  let matches = getAllMatches();
  let source: Source;

  if (mode === "off") {
    source = "off";
  } else if (mode === "simulate") {
    matches = simulateLive(matches, now);
    source = "simulated";
  } else {
    try {
      matches = mergeExternal(matches, await fetchEspnScores());
      source = "live-feed";
    } catch {
      matches = simulateLive(matches, now);
      source = "simulated";
    }
  }

  return Response.json(
    { updatedAt: new Date().toISOString(), source, count: matches.length, matches },
    { headers: { "Cache-Control": "no-store" } },
  );
}
