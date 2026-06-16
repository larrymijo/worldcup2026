import type { Match } from "./types";

// FIFA World Cup 2026 — full 104-match schedule (USA · Canada · Mexico).
//
// Kick-off times are stored in UTC (ISO 8601). The UI converts them to each
// visitor's local timezone. June/July Eastern Time is EDT (UTC-4), so the
// official "ET" kick-off times map to UTC by adding 4 hours.
//
// Group draw (final draw, Dec 2025):
//   A: Mexico, South Africa, South Korea, Czechia
//   B: Canada, Bosnia & Herzegovina, Qatar, Switzerland
//   C: Brazil, Morocco, Haiti, Scotland
//   D: United States, Paraguay, Australia, Türkiye
//   E: Germany, Curaçao, Ivory Coast, Ecuador
//   F: Netherlands, Japan, Sweden, Tunisia
//   G: Belgium, Egypt, Iran, New Zealand
//   H: Spain, Cape Verde, Saudi Arabia, Uruguay
//   I: France, Senegal, Iraq, Norway
//   J: Argentina, Algeria, Austria, Jordan
//   K: Portugal, DR Congo, Uzbekistan, Colombia
//   L: England, Croatia, Ghana, Panama

export const MATCHES: Match[] = [
  // ---------------- GROUP STAGE ----------------
  // Matchday 1
  { id: 1, kickoff: "2026-06-11T19:00:00Z", stage: "Group", group: "A", home: "Mexico", away: "South Africa", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: 2, kickoff: "2026-06-12T02:00:00Z", stage: "Group", group: "A", home: "South Korea", away: "Czechia", venue: "Estadio Akron", city: "Guadalajara", country: "Mexico" },
  { id: 3, kickoff: "2026-06-12T19:00:00Z", stage: "Group", group: "B", home: "Canada", away: "Bosnia & Herzegovina", venue: "BMO Field", city: "Toronto", country: "Canada" },
  { id: 4, kickoff: "2026-06-13T01:00:00Z", stage: "Group", group: "D", home: "United States", away: "Paraguay", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 5, kickoff: "2026-06-13T19:00:00Z", stage: "Group", group: "B", home: "Qatar", away: "Switzerland", venue: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA" },
  { id: 6, kickoff: "2026-06-13T22:00:00Z", stage: "Group", group: "C", home: "Brazil", away: "Morocco", venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
  { id: 7, kickoff: "2026-06-14T01:00:00Z", stage: "Group", group: "C", home: "Haiti", away: "Scotland", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: 8, kickoff: "2026-06-14T04:00:00Z", stage: "Group", group: "D", home: "Australia", away: "Türkiye", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: 9, kickoff: "2026-06-14T17:00:00Z", stage: "Group", group: "E", home: "Germany", away: "Curaçao", venue: "NRG Stadium", city: "Houston", country: "USA" },
  { id: 10, kickoff: "2026-06-14T20:00:00Z", stage: "Group", group: "F", home: "Netherlands", away: "Japan", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 11, kickoff: "2026-06-14T23:00:00Z", stage: "Group", group: "E", home: "Ivory Coast", away: "Ecuador", venue: "Lincoln Financial Field", city: "Philadelphia", country: "USA" },
  { id: 12, kickoff: "2026-06-15T02:00:00Z", stage: "Group", group: "F", home: "Sweden", away: "Tunisia", venue: "Estadio BBVA", city: "Monterrey", country: "Mexico" },
  { id: 13, kickoff: "2026-06-15T16:00:00Z", stage: "Group", group: "H", home: "Spain", away: "Cape Verde", venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  { id: 14, kickoff: "2026-06-15T19:00:00Z", stage: "Group", group: "G", home: "Belgium", away: "Egypt", venue: "Lumen Field", city: "Seattle", country: "USA" },
  { id: 15, kickoff: "2026-06-15T22:00:00Z", stage: "Group", group: "H", home: "Saudi Arabia", away: "Uruguay", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: 16, kickoff: "2026-06-16T01:00:00Z", stage: "Group", group: "G", home: "Iran", away: "New Zealand", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 17, kickoff: "2026-06-16T19:00:00Z", stage: "Group", group: "I", home: "France", away: "Senegal", venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
  { id: 18, kickoff: "2026-06-16T22:00:00Z", stage: "Group", group: "I", home: "Iraq", away: "Norway", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: 19, kickoff: "2026-06-17T01:00:00Z", stage: "Group", group: "J", home: "Argentina", away: "Algeria", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: 20, kickoff: "2026-06-17T04:00:00Z", stage: "Group", group: "J", home: "Austria", away: "Jordan", venue: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA" },
  { id: 21, kickoff: "2026-06-17T17:00:00Z", stage: "Group", group: "K", home: "Portugal", away: "DR Congo", venue: "NRG Stadium", city: "Houston", country: "USA" },
  { id: 22, kickoff: "2026-06-17T20:00:00Z", stage: "Group", group: "L", home: "England", away: "Croatia", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 23, kickoff: "2026-06-17T23:00:00Z", stage: "Group", group: "L", home: "Ghana", away: "Panama", venue: "BMO Field", city: "Toronto", country: "Canada" },
  { id: 24, kickoff: "2026-06-18T02:00:00Z", stage: "Group", group: "K", home: "Uzbekistan", away: "Colombia", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },

  // Matchday 2
  { id: 25, kickoff: "2026-06-18T16:00:00Z", stage: "Group", group: "A", home: "Czechia", away: "South Africa", venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  { id: 26, kickoff: "2026-06-18T19:00:00Z", stage: "Group", group: "B", home: "Switzerland", away: "Bosnia & Herzegovina", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 27, kickoff: "2026-06-18T22:00:00Z", stage: "Group", group: "B", home: "Canada", away: "Qatar", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: 28, kickoff: "2026-06-19T01:00:00Z", stage: "Group", group: "A", home: "Mexico", away: "South Korea", venue: "Estadio Akron", city: "Guadalajara", country: "Mexico" },
  { id: 29, kickoff: "2026-06-19T19:00:00Z", stage: "Group", group: "D", home: "United States", away: "Australia", venue: "Lumen Field", city: "Seattle", country: "USA" },
  { id: 30, kickoff: "2026-06-19T22:00:00Z", stage: "Group", group: "C", home: "Scotland", away: "Morocco", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: 31, kickoff: "2026-06-20T00:30:00Z", stage: "Group", group: "C", home: "Brazil", away: "Haiti", venue: "Lincoln Financial Field", city: "Philadelphia", country: "USA" },
  { id: 32, kickoff: "2026-06-20T03:00:00Z", stage: "Group", group: "D", home: "Türkiye", away: "Paraguay", venue: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA" },
  { id: 33, kickoff: "2026-06-20T17:00:00Z", stage: "Group", group: "F", home: "Netherlands", away: "Sweden", venue: "NRG Stadium", city: "Houston", country: "USA" },
  { id: 34, kickoff: "2026-06-20T20:00:00Z", stage: "Group", group: "E", home: "Germany", away: "Ivory Coast", venue: "BMO Field", city: "Toronto", country: "Canada" },
  { id: 35, kickoff: "2026-06-21T00:00:00Z", stage: "Group", group: "E", home: "Ecuador", away: "Curaçao", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: 36, kickoff: "2026-06-21T04:00:00Z", stage: "Group", group: "F", home: "Tunisia", away: "Japan", venue: "Estadio BBVA", city: "Monterrey", country: "Mexico" },
  { id: 37, kickoff: "2026-06-21T16:00:00Z", stage: "Group", group: "H", home: "Spain", away: "Saudi Arabia", venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  { id: 38, kickoff: "2026-06-21T19:00:00Z", stage: "Group", group: "G", home: "Belgium", away: "Iran", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 39, kickoff: "2026-06-21T22:00:00Z", stage: "Group", group: "H", home: "Uruguay", away: "Cape Verde", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: 40, kickoff: "2026-06-22T01:00:00Z", stage: "Group", group: "G", home: "New Zealand", away: "Egypt", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: 41, kickoff: "2026-06-22T17:00:00Z", stage: "Group", group: "J", home: "Argentina", away: "Austria", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 42, kickoff: "2026-06-22T21:00:00Z", stage: "Group", group: "I", home: "France", away: "Iraq", venue: "Lincoln Financial Field", city: "Philadelphia", country: "USA" },
  { id: 43, kickoff: "2026-06-23T00:00:00Z", stage: "Group", group: "I", home: "Norway", away: "Senegal", venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
  { id: 44, kickoff: "2026-06-23T03:00:00Z", stage: "Group", group: "J", home: "Jordan", away: "Algeria", venue: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA" },
  { id: 45, kickoff: "2026-06-23T17:00:00Z", stage: "Group", group: "K", home: "Portugal", away: "Uzbekistan", venue: "NRG Stadium", city: "Houston", country: "USA" },
  { id: 46, kickoff: "2026-06-23T20:00:00Z", stage: "Group", group: "L", home: "England", away: "Ghana", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: 47, kickoff: "2026-06-23T23:00:00Z", stage: "Group", group: "L", home: "Panama", away: "Croatia", venue: "BMO Field", city: "Toronto", country: "Canada" },
  { id: 48, kickoff: "2026-06-24T02:00:00Z", stage: "Group", group: "K", home: "Colombia", away: "DR Congo", venue: "Estadio Akron", city: "Guadalajara", country: "Mexico" },

  // Matchday 3
  { id: 49, kickoff: "2026-06-24T19:00:00Z", stage: "Group", group: "B", home: "Switzerland", away: "Canada", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: 50, kickoff: "2026-06-24T19:00:00Z", stage: "Group", group: "B", home: "Bosnia & Herzegovina", away: "Qatar", venue: "Lumen Field", city: "Seattle", country: "USA" },
  { id: 51, kickoff: "2026-06-24T22:00:00Z", stage: "Group", group: "C", home: "Scotland", away: "Brazil", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: 52, kickoff: "2026-06-24T22:00:00Z", stage: "Group", group: "C", home: "Morocco", away: "Haiti", venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  { id: 53, kickoff: "2026-06-25T01:00:00Z", stage: "Group", group: "A", home: "Czechia", away: "Mexico", venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: 54, kickoff: "2026-06-25T01:00:00Z", stage: "Group", group: "A", home: "South Africa", away: "South Korea", venue: "Estadio BBVA", city: "Monterrey", country: "Mexico" },
  { id: 55, kickoff: "2026-06-25T20:00:00Z", stage: "Group", group: "E", home: "Ecuador", away: "Germany", venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
  { id: 56, kickoff: "2026-06-25T20:00:00Z", stage: "Group", group: "E", home: "Curaçao", away: "Ivory Coast", venue: "Lincoln Financial Field", city: "Philadelphia", country: "USA" },
  { id: 57, kickoff: "2026-06-25T23:00:00Z", stage: "Group", group: "F", home: "Japan", away: "Sweden", venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 58, kickoff: "2026-06-25T23:00:00Z", stage: "Group", group: "F", home: "Tunisia", away: "Netherlands", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: 59, kickoff: "2026-06-26T02:00:00Z", stage: "Group", group: "D", home: "Türkiye", away: "United States", venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 60, kickoff: "2026-06-26T02:00:00Z", stage: "Group", group: "D", home: "Paraguay", away: "Australia", venue: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA" },
  { id: 61, kickoff: "2026-06-26T19:00:00Z", stage: "Group", group: "I", home: "Norway", away: "France", venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: 62, kickoff: "2026-06-26T19:00:00Z", stage: "Group", group: "I", home: "Senegal", away: "Iraq", venue: "BMO Field", city: "Toronto", country: "Canada" },
  { id: 63, kickoff: "2026-06-27T00:00:00Z", stage: "Group", group: "H", home: "Cape Verde", away: "Saudi Arabia", venue: "NRG Stadium", city: "Houston", country: "USA" },
  { id: 64, kickoff: "2026-06-27T00:00:00Z", stage: "Group", group: "H", home: "Uruguay", away: "Spain", venue: "Estadio Akron", city: "Guadalajara", country: "Mexico" },
  { id: 65, kickoff: "2026-06-27T03:00:00Z", stage: "Group", group: "G", home: "Egypt", away: "Iran", venue: "Lumen Field", city: "Seattle", country: "USA" },
  { id: 66, kickoff: "2026-06-27T03:00:00Z", stage: "Group", group: "G", home: "New Zealand", away: "Belgium", venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: 67, kickoff: "2026-06-27T21:00:00Z", stage: "Group", group: "L", home: "Panama", away: "England", venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
  { id: 68, kickoff: "2026-06-27T21:00:00Z", stage: "Group", group: "L", home: "Croatia", away: "Ghana", venue: "Lincoln Financial Field", city: "Philadelphia", country: "USA" },
  { id: 69, kickoff: "2026-06-27T23:30:00Z", stage: "Group", group: "K", home: "Colombia", away: "Portugal", venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: 70, kickoff: "2026-06-27T23:30:00Z", stage: "Group", group: "K", home: "DR Congo", away: "Uzbekistan", venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  { id: 71, kickoff: "2026-06-28T02:00:00Z", stage: "Group", group: "J", home: "Algeria", away: "Austria", venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },
  { id: 72, kickoff: "2026-06-28T02:00:00Z", stage: "Group", group: "J", home: "Jordan", away: "Argentina", venue: "AT&T Stadium", city: "Dallas", country: "USA" },

  // ---------------- ROUND OF 32 ----------------
  { id: 73, kickoff: "2026-06-28T19:00:00Z", stage: "Round of 32", home: "Runner-up Group A", away: "Runner-up Group B", homePlaceholder: true, awayPlaceholder: true, venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 74, kickoff: "2026-06-29T17:00:00Z", stage: "Round of 32", home: "Winner Group C", away: "Runner-up Group F", homePlaceholder: true, awayPlaceholder: true, venue: "NRG Stadium", city: "Houston", country: "USA" },
  { id: 75, kickoff: "2026-06-29T20:30:00Z", stage: "Round of 32", home: "Winner Group E", away: "Third place A/B/C/D/F", homePlaceholder: true, awayPlaceholder: true, venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: 76, kickoff: "2026-06-30T01:00:00Z", stage: "Round of 32", home: "Winner Group F", away: "Runner-up Group C", homePlaceholder: true, awayPlaceholder: true, venue: "Estadio BBVA", city: "Monterrey", country: "Mexico" },
  { id: 77, kickoff: "2026-06-30T17:00:00Z", stage: "Round of 32", home: "Runner-up Group E", away: "Runner-up Group I", homePlaceholder: true, awayPlaceholder: true, venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 78, kickoff: "2026-06-30T21:00:00Z", stage: "Round of 32", home: "Winner Group I", away: "Third place C/D/F/G/H", homePlaceholder: true, awayPlaceholder: true, venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
  { id: 79, kickoff: "2026-07-01T01:00:00Z", stage: "Round of 32", home: "Winner Group A", away: "Third place C/E/F/H/I", homePlaceholder: true, awayPlaceholder: true, venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: 80, kickoff: "2026-07-01T16:00:00Z", stage: "Round of 32", home: "Winner Group L", away: "Third place E/H/I/J/K", homePlaceholder: true, awayPlaceholder: true, venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  { id: 81, kickoff: "2026-07-01T20:00:00Z", stage: "Round of 32", home: "Winner Group G", away: "Third place A/E/H/I/J", homePlaceholder: true, awayPlaceholder: true, venue: "Lumen Field", city: "Seattle", country: "USA" },
  { id: 82, kickoff: "2026-07-02T00:00:00Z", stage: "Round of 32", home: "Winner Group D", away: "Third place B/E/F/I/J", homePlaceholder: true, awayPlaceholder: true, venue: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA" },
  { id: 83, kickoff: "2026-07-02T19:00:00Z", stage: "Round of 32", home: "Winner Group H", away: "Runner-up Group J", homePlaceholder: true, awayPlaceholder: true, venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 84, kickoff: "2026-07-02T23:00:00Z", stage: "Round of 32", home: "Runner-up Group K", away: "Runner-up Group L", homePlaceholder: true, awayPlaceholder: true, venue: "BMO Field", city: "Toronto", country: "Canada" },
  { id: 85, kickoff: "2026-07-03T03:00:00Z", stage: "Round of 32", home: "Winner Group B", away: "Third place E/F/G/I/J", homePlaceholder: true, awayPlaceholder: true, venue: "BC Place", city: "Vancouver", country: "Canada" },
  { id: 86, kickoff: "2026-07-03T18:00:00Z", stage: "Round of 32", home: "Runner-up Group D", away: "Runner-up Group G", homePlaceholder: true, awayPlaceholder: true, venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 87, kickoff: "2026-07-03T22:00:00Z", stage: "Round of 32", home: "Winner Group J", away: "Runner-up Group H", homePlaceholder: true, awayPlaceholder: true, venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: 88, kickoff: "2026-07-04T01:30:00Z", stage: "Round of 32", home: "Winner Group K", away: "Third place D/E/I/J/L", homePlaceholder: true, awayPlaceholder: true, venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },

  // ---------------- ROUND OF 16 ----------------
  { id: 89, kickoff: "2026-07-04T17:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "NRG Stadium", city: "Houston", country: "USA" },
  { id: 90, kickoff: "2026-07-04T21:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Lincoln Financial Field", city: "Philadelphia", country: "USA" },
  { id: 91, kickoff: "2026-07-05T20:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
  { id: 92, kickoff: "2026-07-06T00:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  { id: 93, kickoff: "2026-07-06T19:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 94, kickoff: "2026-07-06T21:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Lumen Field", city: "Seattle", country: "USA" },
  { id: 95, kickoff: "2026-07-07T16:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  { id: 96, kickoff: "2026-07-07T20:00:00Z", stage: "Round of 16", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "BC Place", city: "Vancouver", country: "Canada" },

  // ---------------- QUARTER-FINALS ----------------
  { id: 97, kickoff: "2026-07-09T20:00:00Z", stage: "Quarter-final", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Gillette Stadium", city: "Boston", country: "USA" },
  { id: 98, kickoff: "2026-07-10T19:00:00Z", stage: "Quarter-final", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "SoFi Stadium", city: "Los Angeles", country: "USA" },
  { id: 99, kickoff: "2026-07-11T21:00:00Z", stage: "Quarter-final", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  { id: 100, kickoff: "2026-07-12T01:00:00Z", stage: "Quarter-final", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Arrowhead Stadium", city: "Kansas City", country: "USA" },

  // ---------------- SEMI-FINALS ----------------
  { id: 101, kickoff: "2026-07-14T19:00:00Z", stage: "Semi-final", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "AT&T Stadium", city: "Dallas", country: "USA" },
  { id: 102, kickoff: "2026-07-15T19:00:00Z", stage: "Semi-final", home: "TBD", away: "TBD", homePlaceholder: true, awayPlaceholder: true, venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },

  // ---------------- THIRD-PLACE PLAY-OFF ----------------
  { id: 103, kickoff: "2026-07-18T21:00:00Z", stage: "Third-place", home: "Loser SF1", away: "Loser SF2", homePlaceholder: true, awayPlaceholder: true, venue: "Hard Rock Stadium", city: "Miami", country: "USA" },

  // ---------------- FINAL ----------------
  { id: 104, kickoff: "2026-07-19T19:00:00Z", stage: "Final", home: "Winner SF1", away: "Winner SF2", homePlaceholder: true, awayPlaceholder: true, venue: "MetLife Stadium", city: "New York / New Jersey", country: "USA" },
];

/** All matches, sorted by kick-off. */
export function getAllMatches(): Match[] {
  return [...MATCHES].sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime(),
  );
}

/** Matches that involve a given team (by team key). */
export function getMatchesForTeam(team: string): Match[] {
  return getAllMatches().filter((m) => m.home === team || m.away === team);
}
