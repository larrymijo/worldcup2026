"use client";

import { OrganiskBadge } from "./Sponsor";
import { useI18n } from "./I18nProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer id="site-footer" className="mt-16 scroll-mt-20 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <OrganiskBadge labelKey="sponsor.poweredBy" />

          <div className="hairline w-full max-w-xs" />

          <div className="flex flex-col items-center gap-1 text-xs text-muted sm:flex-row sm:gap-3">
            <span className="font-display text-ink">WORLD CUP 26 · {t("brand.tagline")}</span>
            <span className="hidden text-line sm:inline">|</span>
            <span>{t("footer.kickoff")}</span>
          </div>
          <p className="text-[11px] text-muted/70">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
