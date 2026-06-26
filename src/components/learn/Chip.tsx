import type { ReactNode } from "react";

const toneStyles = {
  accent: { bg: "color-mix(in srgb, var(--accent) 14%, transparent)", color: "var(--accent)" },
  neutral: { bg: "var(--surface-strong)", color: "var(--ink-soft)" },
  warn: { bg: "color-mix(in srgb, var(--warn) 14%, transparent)", color: "var(--warn)" },
} as const;

export function Chip({
  tone = "accent",
  children,
}: {
  tone?: keyof typeof toneStyles;
  children: ReactNode;
}) {
  const styles = toneStyles[tone];
  return (
    <span
      className="inline-flex rounded-[var(--r-pill)] border px-2.5 py-1 text-xs font-semibold"
      style={{ background: styles.bg, color: styles.color, borderColor: "var(--border)" }}
    >
      {children}
    </span>
  );
}
