import { TEAMS, flagUrl } from "@/lib/teams";

interface Props {
  team: string;
  placeholder?: boolean;
  /** rendered pixel size (square-ish flag is 4:3) */
  size?: number;
  className?: string;
}

/**
 * Renders a country flag for a real team, or a neutral "to be decided" chip for
 * an unresolved knockout slot. Uses plain <img> (flagcdn.com) so no next/image
 * remote-host config is required.
 */
export function TeamFlag({ team, placeholder, size = 36, className = "" }: Props) {
  const meta = !placeholder ? TEAMS[team] : undefined;

  if (!meta) {
    return (
      <span
        className={`grid place-items-center rounded-md border border-white/10 bg-white/5 text-muted ${className}`}
        style={{ width: size, height: Math.round(size * 0.72) }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none">
          <path
            d="M7 21h10M12 17v4M5 4h14v3a7 7 0 0 1-14 0V4Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  const w = (size <= 40 ? 80 : 160) as 80 | 160;
  return (
    <img
      src={flagUrl(meta.code, w)}
      srcSet={`${flagUrl(meta.code, w)} 1x, ${flagUrl(meta.code, (w * 2) as 160 | 320)} 2x`}
      alt={`${meta.name} flag`}
      width={size}
      height={Math.round(size * 0.72)}
      loading="lazy"
      className={`rounded-md object-cover shadow-sm ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: Math.round(size * 0.72) }}
    />
  );
}
