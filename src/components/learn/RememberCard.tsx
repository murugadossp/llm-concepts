import type { ReactNode } from "react";

export function RememberCard({ children }: { children: ReactNode }) {
  return (
    <aside
      className="glass-strong my-8 border p-6"
      style={{ borderColor: "var(--sun)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--sun) 35%, transparent)" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span aria-hidden>💡</span>
        <h3 className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>
          Remember
        </h3>
      </div>
      <div className="text-sm leading-7" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </aside>
  );
}
