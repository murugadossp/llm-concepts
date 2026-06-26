import type { ReactNode } from "react";

export function ELI5Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside
      className="my-6 rounded-r-[var(--r-sm)] border-l-[3px] px-4 py-3.5"
      style={{
        borderLeftColor: "var(--accent)",
        background: "var(--surface-muted)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span aria-hidden>🧒</span>
        <h4 className="font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </h4>
      </div>
      <div className="text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </aside>
  );
}
