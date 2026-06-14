"use client";

import type { MatchStatus } from "@/lib/types";
import { useI18n } from "./I18nProvider";

export function StatusBadge({ status, minute }: { status: MatchStatus; minute?: string }) {
  const { t } = useI18n();
  if (status === "live") {
    const label = minute === "HT" ? t("status.ht") : minute;
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-ec-red/40 bg-ec-red/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300">
        <span className="live-dot h-2 w-2 rounded-full bg-ec-red" />
        {t("status.live")}
        {label && <span className="tabular-nums text-red-200/90">· {label}</span>}
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
        {t("status.ft")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-pitch/30 bg-pitch/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-pitch">
      <span className="h-2 w-2 rounded-full bg-pitch" />
      {t("status.upcoming")}
    </span>
  );
}
