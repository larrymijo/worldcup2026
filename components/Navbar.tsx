"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";
import { OrganiskLogoLink } from "./Sponsor";
import type { Locale } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: "/", label: t("nav.matches"), flag: "" },
    { href: "/predict", label: t("nav.predict"), flag: "" },
    { href: "/ecuador", label: t("nav.ecuador"), flag: "🇪🇨" },
  ];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-white/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
          {/* Left: brand + sponsor */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
              <span className="bg-pitch-grad grid h-8 w-8 shrink-0 place-items-center rounded-xl text-base shadow-lg shadow-pitch/20 sm:h-9 sm:w-9 sm:text-lg">
                ⚽
              </span>
              <span className="hidden min-w-0 flex-col leading-none sm:flex">
                <span className="whitespace-nowrap font-display text-base font-bold tracking-wide text-ink sm:text-lg">
                  WORLD CUP <span className="text-gradient">26</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">
                  {t("brand.tagline")}
                </span>
              </span>
            </Link>
            <span className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden />
            <OrganiskLogoLink />
          </div>

          {/* Right: desktop nav + language */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                    isActive(link.href) ? "bg-white text-night shadow" : "text-muted hover:text-ink"
                  }`}
                >
                  {link.flag && (
                    <span className="mr-1" aria-hidden>
                      {link.flag}
                    </span>
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
            <LanguageToggle locale={locale} onChange={setLocale} label={t("lang.switch")} />
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-ink sm:hidden"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu panel */}
        {open && (
          <div className="border-t border-white/10 px-3 pb-3 pt-2 sm:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive(link.href) ? "bg-white text-night" : "text-muted hover:bg-white/5 hover:text-ink"
                  }`}
                >
                  {link.flag && (
                    <span className="mr-2" aria-hidden>
                      {link.flag}
                    </span>
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-xs uppercase tracking-wider text-muted">{t("lang.switch")}</span>
              <LanguageToggle locale={locale} onChange={setLocale} label={t("lang.switch")} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function LanguageToggle({
  locale,
  onChange,
  label,
}: {
  locale: Locale;
  onChange: (l: Locale) => void;
  label: string;
}) {
  return (
    <div
      className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-[11px] font-bold"
      role="group"
      aria-label={label}
    >
      {(["es", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-2 py-1 uppercase transition ${
            locale === l ? "bg-white text-night" : "text-muted hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
