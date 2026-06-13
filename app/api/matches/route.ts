import { getAllMatches } from "@/lib/matches";

// World Cup 2026 fixtures endpoint. The data is a curated, static dataset, so
// the response is fully cacheable. Swap `getAllMatches()` for a live upstream
// fetch here (e.g. a sports data API) and the rest of the app keeps working —
// the client always reads from /api/matches.
export const dynamic = "force-static";

export async function GET() {
  const matches = getAllMatches();
  return Response.json(
    { updatedAt: new Date().toISOString(), count: matches.length, matches },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
