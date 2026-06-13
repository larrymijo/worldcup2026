"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  detectLocale,
  LANG_STORAGE_KEY,
  makeT,
  type Locale,
  type TFunc,
} from "@/lib/i18n";

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: TFunc;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Start as Spanish (the default) so server and first client render match,
  // then resolve the real preference on the client to avoid hydration errors.
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    let initial: Locale;
    // ?lang=en|es wins (handy for sharing language-specific links), then a saved
    // choice, then the browser language (defaulting to Spanish).
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "en" || q === "es") {
      initial = q;
      try {
        localStorage.setItem(LANG_STORAGE_KEY, q);
      } catch {
        /* ignore */
      }
    } else {
      try {
        const saved = localStorage.getItem(LANG_STORAGE_KEY) as Locale | null;
        initial = saved === "en" || saved === "es" ? saved : detectLocale();
      } catch {
        initial = detectLocale();
      }
    }
    setLocaleState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "es" ? "en" : "es");
  }, [locale, setLocale]);

  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, toggle, t: makeT(locale) }),
    [locale, setLocale, toggle],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
