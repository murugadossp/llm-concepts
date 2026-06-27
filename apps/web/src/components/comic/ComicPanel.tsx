import type { ReactNode } from "react";

type ComicPanelProps = {
  character?: string;
  title?: string;
  children: ReactNode;
};

export function ComicPanel({ character, title, children }: ComicPanelProps) {
  return (
    <article className="lesson-card min-w-[260px] flex-1 snap-center p-5">
      {title ? (
        <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </h3>
      ) : null}
      {character ? (
        <p
          className="mt-1 text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--accent-2)" }}
        >
          {character}
        </p>
      ) : null}
      <div
        className="comic-dialogue mt-3 space-y-2 text-[15px] leading-relaxed"
        style={{ color: "var(--ink-soft)" }}
      >
        {children}
      </div>
    </article>
  );
}
