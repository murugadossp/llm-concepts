"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(preference: ThemePreference): Theme {
  if (preference === "light" || preference === "dark") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function readStoredPreference(): ThemePreference | null {
  try {
    return window.localStorage?.getItem("theme") as ThemePreference | null;
  } catch {
    return null;
  }
}

function storePreference(preference: ThemePreference) {
  try {
    window.localStorage?.setItem("theme", preference);
  } catch {
    // Theme switching should still work when storage is unavailable.
  }
}

export function ThemeProvider({
  children,
  defaultPreference = "system",
}: {
  children: React.ReactNode;
  defaultPreference?: ThemePreference;
}) {
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);
  const [theme, setTheme] = useState<Theme>("light");

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    storePreference(next);
    const resolved = resolveTheme(next);
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  useEffect(() => {
    const stored = readStoredPreference();
    const initial = stored ?? defaultPreference;
    setPreferenceState(initial);
    const resolved = resolveTheme(initial);
    setTheme(resolved);
    applyTheme(resolved);

    if (initial !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolvedTheme = resolveTheme("system");
      setTheme(resolvedTheme);
      applyTheme(resolvedTheme);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [defaultPreference]);

  const value = useMemo(
    () => ({ theme, preference, setPreference }),
    [theme, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
