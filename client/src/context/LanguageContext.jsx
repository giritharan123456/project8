import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../locales/en.json";
import ta from "../locales/ta.json";
import hi from "../locales/hi.json";
import { getProfile, updateLanguage as apiUpdateLanguage } from "../api/profile.js";

const STORAGE_KEY = "chemquest-language";

// Centralized translation bundles (Section 9's brief). Add a new language
// by dropping a src/locales/<code>.json file with the same keys as
// en.json, then adding one entry here and to LANGUAGES below — no other
// component needs to change.
const BUNDLES = { en, ta, hi };

// Shown in the language selector UI, in this order. `nativeLabel` is what
// renders in the picker itself (Section 8's "தமிழ்" / "हिन्दी" example);
// `label` is an English fallback for anywhere space is tight.
export const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ta", label: "Tamil", nativeLabel: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd" },
  { code: "hi", label: "Hindi", nativeLabel: "\u0939\u093f\u0928\u094d\u0926\u0940" },
];

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && BUNDLES[stored]) return stored;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const [hydrated, setHydrated] = useState(false);

  // On first mount, prefer whatever's saved on the player's backend
  // profile (Section 7/8: "keep the selection after logout/login where
  // appropriate") over the localStorage fallback, in case they set their
  // language preference on a different device/session.
  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((profile) => {
        if (!cancelled && profile?.language && BUNDLES[profile.language]) {
          setLanguageState(profile.language);
        }
      })
      .catch(() => {
        // No backend yet, or request failed — localStorage value stands.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore write failures (private browsing, quota, etc.)
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (code) => {
    if (!BUNDLES[code]) return;
    setLanguageState(code);
    // Best-effort persistence to the backend so the choice survives
    // logout/login on the same account; localStorage above already covers
    // "survives refresh" even if this fails.
    apiUpdateLanguage(code).catch(() => {});
  };

  // t("key") looks up the active bundle, falling back to English and then
  // to the raw key itself so a missing translation never renders "undefined".
  const t = useMemo(() => {
    const bundle = BUNDLES[language] ?? BUNDLES.en;
    return (key) => bundle[key] ?? BUNDLES.en[key] ?? key;
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, languages: LANGUAGES, hydrated }),
    [language, hydrated]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
