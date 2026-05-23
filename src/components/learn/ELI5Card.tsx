import type { ReactNode } from "react";

export function ELI5Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside
      className="glass my-6 border-l-4 p-5"
      style={{ borderLeftColor: "var(--accent)" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span aria-hidden>🧒</span>
        <h4 className="font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </h4>
      </div>
      <div className="text-sm leading-7" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </aside>
  );
}
