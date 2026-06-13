// Team metadata: display name + ISO 3166-1 alpha-2 code used for flag images
// (served from flagcdn.com). Sub-national teams use flagcdn's gb-* codes.

export interface Team {
  name: string;
  /** flagcdn country code, e.g. "ec", "gb-sct". */
  code: string;
}

export const TEAMS: Record<string, Team> = {
  Mexico: { name: "Mexico", code: "mx" },
  "South Africa": { name: "South Africa", code: "za" },
  "South Korea": { name: "South Korea", code: "kr" },
  Czechia: { name: "Czechia", code: "cz" },
  Canada: { name: "Canada", code: "ca" },
  "Bosnia & Herzegovina": { name: "Bosnia & Herzegovina", code: "ba" },
  "United States": { name: "United States", code: "us" },
  Paraguay: { name: "Paraguay", code: "py" },
  Qatar: { name: "Qatar", code: "qa" },
  Switzerland: { name: "Switzerland", code: "ch" },
  Brazil: { name: "Brazil", code: "br" },
  Morocco: { name: "Morocco", code: "ma" },
  Haiti: { name: "Haiti", code: "ht" },
  Scotland: { name: "Scotland", code: "gb-sct" },
  Australia: { name: "Australia", code: "au" },
  "Türkiye": { name: "Türkiye", code: "tr" },
  Germany: { name: "Germany", code: "de" },
  "Curaçao": { name: "Curaçao", code: "cw" },
  Netherlands: { name: "Netherlands", code: "nl" },
  Japan: { name: "Japan", code: "jp" },
  "Ivory Coast": { name: "Ivory Coast", code: "ci" },
  Ecuador: { name: "Ecuador", code: "ec" },
  Sweden: { name: "Sweden", code: "se" },
  Tunisia: { name: "Tunisia", code: "tn" },
  Spain: { name: "Spain", code: "es" },
  "Cape Verde": { name: "Cape Verde", code: "cv" },
  Belgium: { name: "Belgium", code: "be" },
  Egypt: { name: "Egypt", code: "eg" },
  "Saudi Arabia": { name: "Saudi Arabia", code: "sa" },
  Uruguay: { name: "Uruguay", code: "uy" },
  Iran: { name: "Iran", code: "ir" },
  "New Zealand": { name: "New Zealand", code: "nz" },
  France: { name: "France", code: "fr" },
  Senegal: { name: "Senegal", code: "sn" },
  Iraq: { name: "Iraq", code: "iq" },
  Norway: { name: "Norway", code: "no" },
  Argentina: { name: "Argentina", code: "ar" },
  Algeria: { name: "Algeria", code: "dz" },
  Austria: { name: "Austria", code: "at" },
  Jordan: { name: "Jordan", code: "jo" },
  Portugal: { name: "Portugal", code: "pt" },
  "DR Congo": { name: "DR Congo", code: "cd" },
  England: { name: "England", code: "gb-eng" },
  Croatia: { name: "Croatia", code: "hr" },
  Ghana: { name: "Ghana", code: "gh" },
  Panama: { name: "Panama", code: "pa" },
  Uzbekistan: { name: "Uzbekistan", code: "uz" },
  Colombia: { name: "Colombia", code: "co" },
};

/** Resolve a flag image URL for a given flagcdn code and pixel width. */
export function flagUrl(code: string, width: 40 | 80 | 160 | 320 = 80): string {
  return `https://flagcdn.com/w${width}/${code}.png`;
}
