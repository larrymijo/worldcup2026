"use client";

import type { StandingRow } from "@/lib/standings";
import { TEAMS } from "@/lib/teams";
import { TeamCrest } from "./TeamCrest";
import { useI18n } from "./I18nProvider";

const name = (t: string) => TEAMS[t]?.name ?? t;

/**
 * A compact group standings table. Top `qualify` rows are tinted green
 * (advance), and an optional third row is tinted amber (play-off contender).
 */
export function StandingsTable({
  rows,
  crests,
  qualify = 2,
  highlightThird = false,
  highlightTeam,
}: {
  rows: StandingRow[];
  crests?: Record<string, string>;
  qualify?: number;
  highlightThird?: boolean;
  highlightTeam?: string;
}) {
  const { t } = useI18n();
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="text-[10px] uppercase tracking-wider text-muted">
          <th className="w-6 px-1 py-1 text-left font-semibold">#</th>
          <th className="px-1 py-1 text-left font-semibold">{t("tbl.team")}</th>
          <th className="w-7 px-1 py-1 text-center font-semibold">{t("tbl.pld")}</th>
          <th className="hidden w-6 px-1 py-1 text-center font-semibold xs:table-cell">{t("team.w")}</th>
          <th className="hidden w-6 px-1 py-1 text-center font-semibold xs:table-cell">{t("team.d")}</th>
          <th className="hidden w-6 px-1 py-1 text-center font-semibold xs:table-cell">{t("team.l")}</th>
          <th className="w-9 px-1 py-1 text-center font-semibold">{t("tbl.gd")}</th>
          <th className="w-8 px-1 py-1 text-center font-bold text-ink">{t("tbl.pts")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const adv = i < qualify;
          const third = highlightThird && i === qualify;
          const me = highlightTeam === r.team;
          return (
            <tr
              key={r.team}
              className={`border-t border-white/5 ${me ? "bg-ec-yellow/10" : ""}`}
            >
              <td className="px-1 py-1.5">
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                    adv ? "bg-pitch text-night" : third ? "bg-gold text-night" : "bg-white/10 text-muted"
                  }`}
                >
                  {i + 1}
                </span>
              </td>
              <td className="px-1 py-1.5">
                <span className="flex items-center gap-2">
                  <TeamCrest team={r.team} crest={crests?.[r.team]} size={20} />
                  <span className={`truncate text-[13px] ${me ? "font-bold text-ec-yellow" : "font-medium text-ink"}`}>
                    {name(r.team)}
                  </span>
                </span>
              </td>
              <td className="px-1 py-1.5 text-center tabular-nums text-muted">{r.played}</td>
              <td className="hidden px-1 py-1.5 text-center tabular-nums text-muted xs:table-cell">{r.w}</td>
              <td className="hidden px-1 py-1.5 text-center tabular-nums text-muted xs:table-cell">{r.d}</td>
              <td className="hidden px-1 py-1.5 text-center tabular-nums text-muted xs:table-cell">{r.l}</td>
              <td className="px-1 py-1.5 text-center tabular-nums text-muted">
                {r.gd > 0 ? `+${r.gd}` : r.gd}
              </td>
              <td className="px-1 py-1.5 text-center font-display text-base font-bold tabular-nums text-ink">
                {r.pts}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
