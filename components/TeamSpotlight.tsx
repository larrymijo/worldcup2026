"use client";

import { useMemo } from "react";
import type { Match } from "@/lib/types";
import { TEAMS } from "@/lib/teams";
import { statusOf } from "@/lib/time";
import { useI18n } from "./I18nProvider";
import { TeamCrest } from "./TeamCrest";

/**
 * Banner shown above the fixture list when a single team is selected: badge,
 * name, group, a computed W-D-L record (from finished matches) and recent form.
 */
export function TeamSpotlight({
  team,
  crest,
  matches,
  now,
}: {
  team: string;
  crest?: string;
  matches: Match[];
  now: number;
}) {
  const { t } = useI18n();

  const { played, w, d, l, gf, ga, group, form } = useMemo(() => {
    let played = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0;
    let group: string | undefined;
    for (const m of matches) {
      group ??= m.group;
      if (statusOf(m, now) !== "finished" || m.score == null) continue;
      const isHome = m.home === team;
      const us = isHome ? m.score.home : m.score.away;
      const them = isHome ? m.score.away : m.score.home;
      played++; gf += us; ga += them;
      if (us > them) w++; else if (us < them) l++; else d++;
    }
    let form: string | undefined;
    for (const m of [...matches].sort((a, b) => +new Date(b.kickoff) - +new Date(a.kickoff))) {
      if (statusOf(m, now) !== "finished") continue;
      const f = m.home === team ? m.detail?.form?.home : m.detail?.form?.away;
      if (f) { form = f; break; }
    }
    return { played, w, d, l, gf, ga, group, form };
  }, [matches, team, now]);

  const stats: [string, number | string][] = [
    [t("team.played"), played],
    [t("team.w"), w],
    [t("team.d"), d],
    [t("team.l"), l],
    [t("team.gf"), gf],
    [t("team.ga"), ga],
  ];

  return (
    <div className="glass animate-in mb-6 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <TeamCrest team={team} crest={crest} size={60} />
          <div>
            <h2 className="font-display text-xl font-bold text-ink">{TEAMS[team]?.name ?? team}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {group && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-muted">
                  {t("stage.group")} {group}
                </span>
              )}
              {form && (
                <span className="inline-flex items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted">{t("team.form")}</span>
                  {form.split("").slice(-5).map((r, i) => (
                    <span
                      key={i}
                      className={`grid h-4 w-4 place-items-center rounded text-[9px] font-bold ${
                        r === "W" ? "bg-pitch text-night" : r === "L" ? "bg-ec-red/80 text-white" : "bg-white/15 text-ink"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-white/8 bg-white/5 px-2 py-1.5 text-center">
              <div className="font-display text-base font-bold tabular-nums text-ink">{value}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
