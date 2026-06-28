"use client";

import { Info, Sparkles } from "lucide-react";
import { useState } from "react";

type AttentionSentence = {
  text: string;
  tokens: string[];
  // Map of token query index -> list of attention weights (must align with tokens array)
  weights: Record<number, number[]>;
  explanation: Record<number, string>;
};

const SENTENCES: AttentionSentence[] = [
  {
    text: "The chef cooked the soup because it was hot.",
    tokens: ["The", "chef", "cooked", "the", "soup", "because", "it", "was", "hot", "."],
    weights: {
      // Query "it" (index 6) attends heavily to "soup" (index 4) because of "hot"
      6: [0.02, 0.05, 0.05, 0.03, 0.65, 0.02, 0.1, 0.02, 0.05, 0.01],
      // Query "cooked" (index 2) attends to "chef" (subject) and "soup" (object)
      2: [0.01, 0.45, 0.1, 0.02, 0.35, 0.01, 0.02, 0.01, 0.02, 0.01],
      // Query "chef" (index 1)
      1: [0.15, 0.68, 0.05, 0.01, 0.02, 0.01, 0.02, 0.01, 0.04, 0.01],
      // Query "hot" (index 8) attends to "soup"
      8: [0.01, 0.02, 0.04, 0.02, 0.72, 0.01, 0.08, 0.01, 0.08, 0.01],
    },
    explanation: {
      6: "Because the descriptor is 'hot', the token 'it' heavily attends (65%) to 'soup', updating its vector to represent the food.",
      2: "The action 'cooked' coordinates both the actor ('chef' at 45%) and the target ('soup' at 35%).",
      1: "The subject 'chef' focuses primarily on itself (68%) and the start token (15%).",
      8: "The adjective 'hot' links strongly back to the noun it describes ('soup' at 72%).",
    },
  },
  {
    text: "The chef cooked the soup because it was hungry.",
    tokens: ["The", "chef", "cooked", "the", "soup", "because", "it", "was", "hungry", "."],
    weights: {
      // Query "it" (index 6) attends heavily to "chef" (index 1) because of "hungry"
      6: [0.02, 0.68, 0.05, 0.02, 0.08, 0.02, 0.1, 0.01, 0.01, 0.01],
      8: [0.01, 0.78, 0.04, 0.01, 0.02, 0.01, 0.06, 0.01, 0.05, 0.01],
    },
    explanation: {
      6: "Because the descriptor is 'hungry', the token 'it' shifts focus to 'chef' (68%), as only animate actors experience hunger.",
      8: "The state of being 'hungry' points directly to the actor capable of eating ('chef' at 78%).",
    },
  },
];

export function AttentionHeatmap() {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [queryTokenIdx, setQueryTokenIdx] = useState<number | null>(6); // Default select "it"

  const currentSentence = (SENTENCES[sentenceIdx] ?? SENTENCES[0]) as AttentionSentence;

  function selectQueryToken(idx: number) {
    // Only allow selecting tokens that have weights mapped
    if (currentSentence && currentSentence.weights && idx in currentSentence.weights) {
      setQueryTokenIdx(idx);
    }
  }

  function handleSentenceChange(idx: number) {
    setSentenceIdx(idx);
    const targetSentence = (SENTENCES[idx] ?? SENTENCES[0]) as AttentionSentence;
    // Find default query token for the new sentence (typically 6: 'it')
    if (targetSentence && targetSentence.weights) {
      const available = Object.keys(targetSentence.weights).map(Number);
      if (available.includes(6)) {
        setQueryTokenIdx(6);
      } else if (available.length > 0) {
        setQueryTokenIdx(available[0] ?? null);
      } else {
        setQueryTokenIdx(null);
      }
    } else {
      setQueryTokenIdx(null);
    }
  }

  const activeWeights =
    queryTokenIdx !== null && currentSentence.weights
      ? (currentSentence.weights[queryTokenIdx] ?? null)
      : null;

  const activeExplanation =
    queryTokenIdx !== null && currentSentence.explanation
      ? (currentSentence.explanation[queryTokenIdx] ?? "")
      : "";

  return (
    <div className="glass my-8 p-5">
      <div
        className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 mb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Interactive Attention Heatmap
        </h4>
        <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
          How self-attention calculates word context
        </span>
      </div>

      {/* Sentence Switcher */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SENTENCES.map((s, idx) => (
          <button
            key={s.text}
            type="button"
            onClick={() => handleSentenceChange(idx)}
            className="rounded-[var(--r-pill)] px-3 py-1.5 text-xs font-medium transition"
            style={{
              background: idx === sentenceIdx ? "var(--accent)" : "var(--surface-muted)",
              color: idx === sentenceIdx ? "#fff" : "var(--ink-soft)",
              border: `1px solid ${idx === sentenceIdx ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            Sentence {idx + 1}: &quot;...{s.tokens[s.tokens.length - 2]}&quot;
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Token Row */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>
            Select a highlighted query token (colored outline) to see where its attention goes:
          </p>
          <div
            className="flex flex-wrap gap-2 items-center p-4 rounded-[var(--r-md)] border"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            {currentSentence.tokens.map((token, idx) => {
              const isQueryCandidate = currentSentence.weights && idx in currentSentence.weights;
              const isActiveQuery = idx === queryTokenIdx;
              const weight = activeWeights ? (activeWeights[idx] ?? 0) : 0;

              return (
                <button
                  key={`${idx}-${token}`}
                  type="button"
                  disabled={!isQueryCandidate}
                  onClick={() => selectQueryToken(idx)}
                  className="rounded-[var(--r-sm)] px-2.5 py-1.5 font-mono text-xs font-medium transition select-none disabled:cursor-default"
                  style={{
                    border: isQueryCandidate
                      ? isActiveQuery
                        ? "2px solid var(--accent)"
                        : "2px dashed var(--accent-2)"
                      : "1px solid var(--border)",
                    background: activeWeights
                      ? `color-mix(in srgb, var(--accent) ${Math.round(weight * 100)}%, var(--surface-muted))`
                      : "var(--surface-muted)",
                    color: "var(--ink)",
                  }}
                  title={
                    isQueryCandidate
                      ? "Click to use as query"
                      : `Receives ${(weight * 100).toFixed(0)}% attention`
                  }
                >
                  {token}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Attention Results */}
        {queryTokenIdx !== null && activeWeights && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p
                className="text-xs font-semibold animate-pulse flex items-center gap-1.5"
                style={{ color: "var(--accent)" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Attention Weights for &apos;{currentSentence.tokens[queryTokenIdx]}&apos;:
              </p>
              <div
                className="rounded-[var(--r-sm)] p-3 border text-xs space-y-1.5"
                style={{ background: "var(--surface-muted)", borderColor: "var(--border)" }}
              >
                {currentSentence.tokens.map((token, idx) => {
                  const weight = activeWeights[idx] ?? 0;
                  if (weight < 0.02) return null; // skip tiny ones to save space
                  return (
                    <div
                      key={`${idx}-${token}-weight`}
                      className="flex justify-between items-center font-mono"
                    >
                      <span>{token}</span>
                      <span
                        className="font-semibold"
                        style={{ color: idx === queryTokenIdx ? "var(--accent)" : "var(--ink)" }}
                      >
                        {(weight * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="rounded-[var(--r-sm)] p-4 flex flex-col justify-center border text-xs leading-relaxed"
              style={{
                background: "color-mix(in srgb, var(--accent) 5%, var(--surface))",
                borderColor: "var(--border)",
              }}
            >
              <h5 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                Why this connection?
              </h5>
              <p style={{ color: "var(--ink-soft)" }}>{activeExplanation}</p>
            </div>
          </div>
        )}
      </div>

      <div
        className="mt-5 flex gap-2 rounded-[var(--r-sm)] px-3 py-2 text-xs items-start"
        style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <span>
          <strong>What is happening:</strong> The model projects the sentence into Query, Key, and
          Value vectors. Softmax weights dictate information transfer. Notice how changing a single
          final word (&quot;hot&quot; vs &quot;hungry&quot;) completely alters which noun the
          pronoun &quot;it&quot; attends to.
        </span>
      </div>
    </div>
  );
}
