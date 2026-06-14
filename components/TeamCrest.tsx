"use client";

import { TEAMS } from "@/lib/teams";
import { TeamFlag } from "./TeamFlag";

interface Props {
  team: string;
  /** ESPN crest/badge URL; falls back to the flag when absent. */
  crest?: string;
  placeholder?: boolean;
  size?: number;
  className?: string;
}

/**
 * A round team badge. Uses the ESPN crest when the live feed provides one,
 * otherwise gracefully falls back to the country flag.
 */
export function TeamCrest({ team, crest, placeholder, size = 44, className = "" }: Props) {
  if (!placeholder && crest) {
    return (
      <img
        src={crest}
        alt={`${TEAMS[team]?.name ?? team} badge`}
        width={size}
        height={size}
        loading="lazy"
        className={`rounded-full bg-white/5 object-contain p-0.5 ring-1 ring-white/10 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return <TeamFlag team={team} placeholder={placeholder} size={size} className={className} />;
}
