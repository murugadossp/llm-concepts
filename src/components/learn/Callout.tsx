import type { ReactNode } from "react";

const variantStyles = {
  tip: "var(--accent-2)",
  warn: "var(--warn)",
  myth: "var(--sun)",
} as const;

export function Callout({
  variant = "tip",
  title,
  children,
}: {
  variant?: keyof typeof variantStyles;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside
      className="my-6 rounded-r-[var(--r-sm)] border-l-[3px] px-4 py-3.5"
      style={{ borderLeftColor: variantStyles[variant], background: "var(--surface-muted)" }}
    >
      {title ? (
        <h4 className="mb-2 font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </h4>
      ) : null}
      <div className="text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </aside>
  );
}
