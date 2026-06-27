import type { ReactNode } from "react";

export function RememberCard({ children }: { children: ReactNode }) {
  return (
    <aside
      className="glass my-8 border p-6"
      style={{
        borderColor: "color-mix(in srgb, var(--sun) 55%, var(--border))",
        background: "color-mix(in srgb, var(--sun) 8%, var(--surface))",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span aria-hidden>💡</span>
        <h3 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
          Remember
        </h3>
      </div>
      <div className="text-sm leading-7" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </aside>
  );
}
