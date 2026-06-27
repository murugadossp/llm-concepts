import type { ReactNode } from "react";

type SpeechBubbleProps = {
  speaker?: string;
  children: ReactNode;
};

export function SpeechBubble({ speaker, children }: SpeechBubbleProps) {
  return (
    <div
      className="relative rounded-[var(--r-md)] border px-3 py-2"
      style={{
        background: "var(--surface-strong)",
        borderColor: "var(--border-strong)",
      }}
    >
      {speaker ? (
        <span
          className="comic-dialogue block text-xs font-semibold"
          style={{ color: "var(--accent)" }}
        >
          {speaker}
        </span>
      ) : null}
      <div className="comic-dialogue mt-1 text-sm leading-snug" style={{ color: "var(--ink)" }}>
        {children}
      </div>
    </div>
  );
}
