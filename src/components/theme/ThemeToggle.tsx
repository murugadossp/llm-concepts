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
    <div className="glass inline-flex items-center gap-0.5 p-1" role="group" aria-label="Theme">
      {options.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setPreference(value)}
            aria-pressed={active}
            aria-label={label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--r-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            style={{
              color: active ? "var(--accent)" : "var(--ink-mute)",
              background: active ? "var(--surface-strong)" : "transparent",
            }}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
