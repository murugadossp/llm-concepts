import type { ReactNode } from "react";

type ComicPanelProps = {
  character?: string;
  title?: string;
  children: ReactNode;
};

export function ComicPanel({ character, title, children }: ComicPanelProps) {
  return (
    <article className="glass min-w-[240px] flex-1 snap-center p-4">
      {title ? (
        <h3 className="font-display text-sm font-semibold" style={{ color: "var(--ink)" }}>
          {title}
        </h3>
      ) : null}
      {character ? (
        <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--accent-2)" }}>
          {character}
        </p>
      ) : null}
      <div className="comic-dialogue mt-3 space-y-2 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {children}
      </div>
    </article>
  );
}
