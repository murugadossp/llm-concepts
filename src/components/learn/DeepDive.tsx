import type { ReactNode } from "react";

export function DeepDive({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="glass my-6 group open:border-[var(--accent)]">
      <summary
        className="cursor-pointer list-none px-5 py-4 font-semibold marker:content-none [&::-webkit-details-marker]:hidden"
        style={{ color: "var(--ink)" }}
      >
        <span className="mr-2 text-[var(--accent)]">▸</span>
        {title}
      </summary>
      <div
        className="border-t px-5 py-4 text-sm leading-7"
        style={{ borderColor: "var(--border)", color: "var(--ink-soft)" }}
      >
        {children}
      </div>
    </details>
  );
}
