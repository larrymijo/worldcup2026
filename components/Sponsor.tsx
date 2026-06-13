"use client";

import { TeamFlag } from "./TeamFlag";
import { useI18n } from "./I18nProvider";

const SITE = "https://organisklm.com";

/** Inline "… Organisk LM" pill. `labelKey` is an i18n key for the lead-in text. */
export function OrganiskBadge({
  labelKey = "sponsor.poweredBy",
  size = "sm",
  className = "",
}: {
  labelKey?: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { t } = useI18n();
  const label = t(labelKey);
  const lg = size === "lg";
  const logoSize = lg ? 36 : 22;
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`${label} Organisk LM (organisklm.com)`}
      className={`group inline-flex items-center rounded-full border border-white/10 bg-white/5 transition hover:border-pitch/50 hover:bg-pitch/10 ${
        lg ? "gap-3 px-5 py-2.5" : "gap-2 px-3 py-1.5"
      } ${className}`}
    >
      <span
        className={`font-medium uppercase tracking-[0.2em] text-muted ${
          lg ? "text-xs" : "text-[10px]"
        }`}
      >
        {label}
      </span>
      <img
        src="/organisk-lm.svg"
        alt="Organisk LM logo"
        width={logoSize}
        height={logoSize}
        style={{ width: logoSize, height: logoSize }}
      />
      <span
        className={`font-display font-bold tracking-wide text-[#84c44f] ${
          lg ? "text-lg" : "text-sm"
        }`}
      >
        ORGANISK&nbsp;LM
      </span>
    </a>
  );
}

/** Animated 3D "Powered by Organisk LM" medallion (spins + floats, links out). */
export function OrganiskAnimated({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`${t("sponsor.poweredBy")} Organisk LM (organisklm.com)`}
      className={`group inline-flex flex-col items-center gap-3 ${className}`}
    >
      <div className="coin-stage">
        <span className="coin-glow" aria-hidden />
        <div className="coin-float">
          <div className="coin">
            <span className="coin-face">
              <img src="/organisk-lm.svg" alt="Organisk LM logo" className="h-full w-full p-2" />
            </span>
            <span className="coin-face coin-face-back" aria-hidden>
              <img src="/organisk-lm.svg" alt="" className="h-full w-full p-2" />
            </span>
          </div>
        </div>
      </div>
      <span className="text-center leading-tight">
        <span className="block text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
          {t("sponsor.poweredBy")}
        </span>
        <span className="block font-display text-base font-bold tracking-wide text-[#84c44f] lg:text-lg">
          ORGANISK&nbsp;LM
        </span>
      </span>
    </a>
  );
}

/** Compact, clickable Organisk logo for the navbar (redirects to organisklm.com). */
export function OrganiskLogoLink({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`${t("sponsor.poweredBy")} Organisk LM (organisklm.com)`}
      title={`${t("sponsor.poweredBy")} Organisk LM`}
      className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 transition hover:border-pitch/50 hover:bg-pitch/10 ${className}`}
    >
      <span className="hidden text-[9px] font-medium uppercase tracking-[0.12em] text-muted md:inline">
        {t("sponsor.poweredBy")}
      </span>
      <img
        src="/organisk-lm.svg"
        alt="Organisk LM logo"
        width={18}
        height={18}
        className="h-[18px] w-[18px]"
      />
      <span className="hidden font-display text-xs font-bold tracking-wide text-[#84c44f] lg:inline">
        ORGANISK&nbsp;LM
      </span>
    </a>
  );
}

/** Ecuador-specific sponsorship banner. */
export function OrganiskSupportsEcuador({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label="Organisk LM · Ecuador (organisklm.com)"
      className={`group relative block overflow-hidden rounded-3xl border border-ec-yellow/30 p-5 transition hover:border-ec-yellow/60 sm:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -left-10 -top-8 h-40 w-40 rounded-full bg-ec-yellow/15 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-40 w-40 rounded-full bg-ec-blue/15 blur-3xl" />
        <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-ec-red/15 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/organisk-lm.svg"
            alt="Organisk LM logo"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 transition group-hover:scale-105"
          />
          <div className="text-center sm:text-left">
            <p className="font-display text-base font-bold leading-snug text-ink sm:text-lg">
              {t("sponsor.supportsPre")}
              <span className="text-ec-yellow">Ecuador</span>
              {t("sponsor.supportsPost")}
            </p>
            <p className="mt-0.5 text-xs text-muted">{t("sponsor.laTri")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            🇪🇨
          </span>
          <TeamFlag team="Ecuador" size={44} />
        </div>
      </div>
    </a>
  );
}
