import type { MatchStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-ec-red/40 bg-ec-red/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300">
        <span className="live-dot h-2 w-2 rounded-full bg-ec-red" />
        Live
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
        Full time
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-pitch/30 bg-pitch/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-pitch">
      <span className="h-2 w-2 rounded-full bg-pitch" />
      Upcoming
    </span>
  );
}
