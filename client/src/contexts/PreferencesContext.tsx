import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type Theme = "light" | "dark" | "system";
type Language = "en" | "es";

interface Preferences {
  theme: Theme;
  language: Language;
  autoConvert: boolean;
  saveHistory: boolean;
  notifications: boolean;
  historyRetentionDays: number;
}

interface PreferencesContextType extends Preferences {
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setAutoConvert: (v: boolean) => void;
  setSaveHistory: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
  setHistoryRetentionDays: (v: number) => void;
  clearAllData: () => void;
}

const DEFAULT_PREFERENCES: Preferences = {
  theme: "system",
  language: "en",
  autoConvert: false,
  saveHistory: true,
  notifications: true,
  historyRetentionDays: 30,
};

const STORAGE_KEY = "linkfy-preferences";


function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  // Load preferences safely
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored
        ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
        : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // resolvedTheme (light/dark)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    return preferences.theme === "system"
      ? getSystemTheme()
      : preferences.theme;
  });


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);


  // Theme Logic (with system support)
  useEffect(() => {
    const current =
      preferences.theme === "system"
        ? getSystemTheme()
        : preferences.theme;

    applyThemeClass(current);
    setResolvedTheme(current);

    // Listen for system changes
    if (preferences.theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");

      const listener = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? "dark" : "light";
        applyThemeClass(newTheme);
        setResolvedTheme(newTheme);
      };

      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [preferences.theme]);

  useEffect(() => {
    if (i18n.language !== preferences.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences.language, i18n]);


  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("linkfy-history");
    setPreferences(DEFAULT_PREFERENCES);
  };

  const value: PreferencesContextType = {
    ...preferences,
    resolvedTheme,
    setTheme: (t) => update("theme", t),
    setLanguage: (l) => update("language", l),
    setAutoConvert: (v) => update("autoConvert", v),
    setSaveHistory: (v) => update("saveHistory", v),
    setNotifications: (v) => update("notifications", v),
    setHistoryRetentionDays: (v) => update("historyRetentionDays", v),
    clearAllData,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}


export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error(
      "usePreferences must be used inside a <PreferencesProvider>"
    );
  }
  return ctx;
}


// FOUC FIX (apply theme instantly BEFORE React loads)
(function immediateThemeFix() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;

    const theme = parsed.theme ?? "system";
    const resolved =
      theme === "system" ? getSystemTheme() : theme;

    applyThemeClass(resolved);
  } catch {
    applyThemeClass(getSystemTheme());
  }
})();
