import type { ReactNode } from "react";

export function FlowDiagram({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <figure className="glass my-8 p-6 text-center">
      {title ? (
        <figcaption className="mb-4 font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </figcaption>
      ) : null}
      <div className="text-sm leading-7" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </figure>
  );
}

export function Infographic({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <figure className="glass my-8 p-6">
      {title ? (
        <figcaption className="mb-4 text-center font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </figcaption>
      ) : null}
      <div className="text-sm leading-7" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </figure>
  );
}
