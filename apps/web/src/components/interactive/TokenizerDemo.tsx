"use client";

import { decode, decodeGenerator, encode } from "gpt-tokenizer/encoding/cl100k_base";
import { useMemo, useState } from "react";

type TokenizerDemoProps = {
  defaultText?: string;
  notes?: string[];
  tasks?: string[];
};

// Illustrative rate only — real pricing varies by model and provider.
const EXAMPLE_RATE_PER_MILLION_USD = 0.15;

type TokenPiece = { ids: number[]; text: string };

type TokenizerResult = {
  pieces: TokenPiece[];
  tokenCount: number;
};

function realTokenize(text: string): TokenizerResult {
  if (!text) return { pieces: [], tokenCount: 0 };
  const ids = encode(text);
  let tokenOffset = 0;
  const pieces = [...decodeGenerator(ids)].map((pieceText) => {
    const pieceTokenCount = encode(pieceText).length;
    const pieceIds = ids.slice(tokenOffset, tokenOffset + pieceTokenCount);
    tokenOffset += pieceIds.length;
    return { ids: pieceIds, text: pieceText };
  });

  if (tokenOffset < ids.length) {
    const remainingIds = ids.slice(tokenOffset);
    pieces.push({ ids: remainingIds, text: decode(remainingIds) });
  }

  return { pieces, tokenCount: ids.length };
}

export function TokenizerDemo({ defaultText = "", notes = [], tasks = [] }: TokenizerDemoProps) {
  const [text, setText] = useState(defaultText);
  const { pieces, tokenCount } = useMemo(() => realTokenize(text), [text]);
  const estimatedCost = (tokenCount / 1_000_000) * EXAMPLE_RATE_PER_MILLION_USD;

  return (
    <div className="glass my-8 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label
          htmlFor="tokenizer-input"
          className="block text-sm font-semibold"
          style={{ color: "var(--ink)" }}
        >
          Tokenizer playground
        </label>
        <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
          Real BPE encoding (cl100k_base — the GPT-4 / GPT-3.5 tokenizer)
        </span>
      </div>
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
        {pieces.map(({ ids, text: tokenText }, index) => {
          const idLabel = ids.join(", ");

          return (
            <span
              key={`${index}-${idLabel}`}
              className="rounded-[var(--r-sm)] px-2 py-1 font-mono text-xs"
              style={{
                background:
                  index % 2 === 0
                    ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                    : "color-mix(in srgb, var(--accent-2) 18%, transparent)",
                color: "var(--ink)",
              }}
              title={`${ids.length === 1 ? "ID" : "IDs"} ${idLabel}`}
            >
              {tokenText.replace(/\n/g, "⏎").replace(/ /g, "·") || "∅"}
              <span className="ml-1 opacity-60">#{idLabel}</span>
            </span>
          );
        })}
      </div>
      <div
        className="mt-4 flex flex-wrap items-center gap-4 rounded-[var(--r-sm)] px-3 py-2 text-xs"
        style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
      >
        <span>
          <strong style={{ color: "var(--ink)" }}>{tokenCount}</strong> tokens
        </span>
        <span>
          <strong style={{ color: "var(--ink)" }}>{text.length}</strong> characters
        </span>
        <span>
          ≈ <strong style={{ color: "var(--ink)" }}>${estimatedCost.toFixed(6)}</strong> at an
          example rate of ${EXAMPLE_RATE_PER_MILLION_USD.toFixed(2)} / 1M tokens
        </span>
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
