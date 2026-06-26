"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { type ThemePreference, useTheme } from "./ThemeProvider";

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <fieldset
      className="inline-flex items-center gap-0.5 rounded-[var(--r-pill)] border p-[3px]"
      style={{ background: "var(--surface-strong)", borderColor: "var(--border-strong)" }}
      aria-label="Theme"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setPreference(value)}
            aria-pressed={active}
            aria-label={label}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[var(--r-pill)] px-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            style={{
              color: active ? "#fff" : "var(--ink-mute)",
              background: active ? "var(--accent)" : "transparent",
              boxShadow: active ? "0 2px 8px var(--ring)" : "none",
            }}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden xl:inline">{value === "system" ? "Auto" : label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
