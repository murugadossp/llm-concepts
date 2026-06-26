"use client";

import { useMemo, useState } from "react";

type TokenizerDemoProps = {
  defaultText?: string;
  notes?: string[];
  tasks?: string[];
};

function mockTokenize(text: string): { token: string; id: number }[] {
  if (!text.trim()) return [];
  return text
    .split(/(\s+|[.,!?;:'"()\-]+)/)
    .filter(Boolean)
    .map((token, index) => ({
      token,
      id: 1000 + index,
    }));
}

export function TokenizerDemo({ defaultText = "", notes = [], tasks = [] }: TokenizerDemoProps) {
  const [text, setText] = useState(defaultText);
  const tokens = useMemo(() => mockTokenize(text), [text]);

  return (
    <div className="glass my-8 p-5">
      <label
        htmlFor="tokenizer-input"
        className="block text-sm font-semibold"
        style={{ color: "var(--ink)" }}
      >
        Tokenizer playground
      </label>
      <textarea
        id="tokenizer-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        className="mt-3 w-full rounded-[var(--r-md)] border px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2"
        style={{
          background: "var(--surface-muted)",
          borderColor: "var(--border-strong)",
          color: "var(--ink)",
        }}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {tokens.map(({ token, id }, index) => (
          <span
            key={id}
            className="rounded-[var(--r-sm)] px-2 py-1 font-mono text-xs"
            style={{
              background:
                index % 2 === 0
                  ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                  : "color-mix(in srgb, var(--accent-2) 18%, transparent)",
              color: "var(--ink)",
            }}
            title={`ID ${id}`}
          >
            {token}
            <span className="ml-1 opacity-60">#{id}</span>
          </span>
        ))}
      </div>
      {notes.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-xs" style={{ color: "var(--ink-mute)" }}>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
      {tasks.length > 0 ? (
        <ol
          className="mt-4 list-decimal space-y-1 pl-5 text-xs"
          style={{ color: "var(--ink-mute)" }}
        >
          {tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
