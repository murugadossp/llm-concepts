"use client";

import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

type SentenceOption = {
  text: string;
  placeholder: string;
  options: string[];
  logits: { word: string; probability: number }[];
};

const EXAMPLES: SentenceOption[] = [
  {
    text: "Large language models generate text one word at a",
    placeholder: "time",
    options: ["time", "page", "speed", "sentence"],
    logits: [
      { word: "time", probability: 0.92 },
      { word: "page", probability: 0.03 },
      { word: "point", probability: 0.02 },
      { word: "byte", probability: 0.01 },
      { word: "moment", probability: 0.008 },
    ],
  },
  {
    text: "To understand agentic systems, we must first learn about",
    placeholder: "tokens",
    options: ["tokens", "databases", "programming", "hardware"],
    logits: [
      { word: "tokens", probability: 0.65 },
      { word: "models", probability: 0.15 },
      { word: "prompts", probability: 0.08 },
      { word: "agents", probability: 0.05 },
      { word: "embeddings", probability: 0.03 },
    ],
  },
  {
    text: "The quick brown fox jumps over the lazy",
    placeholder: "dog",
    options: ["dog", "cat", "fence", "rabbit"],
    logits: [
      { word: "dog", probability: 0.88 },
      { word: "fox", probability: 0.04 },
      { word: "rabbit", probability: 0.02 },
      { word: "sheep", probability: 0.01 },
      { word: "cat", probability: 0.005 },
    ],
  },
];

export function PredictiveWordGame() {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [customGuess, setCustomGuess] = useState("");
  const [revealed, setRevealed] = useState(false);

  const currentExample = (EXAMPLES[selectedExampleIndex] ?? EXAMPLES[0]) as SentenceOption;

  function handleGuessSelect(guess: string) {
    if (revealed) return;
    setUserGuess(guess);
    setCustomGuess("");
  }

  function handleCustomGuessSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (revealed || !customGuess.trim()) return;
    setUserGuess(customGuess.trim().toLowerCase());
  }

  function handleReveal() {
    if (!userGuess) return;
    setRevealed(true);
  }

  function handleReset() {
    setUserGuess("");
    setCustomGuess("");
    setRevealed(false);
  }

  function handleExampleChange(index: number) {
    setSelectedExampleIndex(index);
    setUserGuess("");
    setCustomGuess("");
    setRevealed(false);
  }

  const guessInLogits = currentExample.logits.find(
    (l) => l.word.toLowerCase() === userGuess.toLowerCase(),
  );

  return (
    <div className="glass my-8 p-5">
      <div
        className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 mb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Interactive Game: Next-Token Prediction
        </h4>
        <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
          Experience what an LLM does at its core
        </span>
      </div>

      {/* Example selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {EXAMPLES.map((ex, idx) => (
          <button
            key={ex.text}
            type="button"
            onClick={() => handleExampleChange(idx)}
            className="rounded-[var(--r-pill)] px-3 py-1 text-xs transition"
            style={{
              background: idx === selectedExampleIndex ? "var(--accent)" : "var(--surface-muted)",
              color: idx === selectedExampleIndex ? "#fff" : "var(--ink-soft)",
              border: `1px solid ${idx === selectedExampleIndex ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            Example {idx + 1}
          </button>
        ))}
      </div>

      {/* Sentence prompt */}
      <div
        className="rounded-[var(--r-md)] p-4 mb-4 font-mono text-sm leading-relaxed"
        style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
      >
        <span style={{ color: "var(--ink)" }}>{currentExample.text} </span>
        <span
          className="inline-block px-2 py-0.5 border-b-2 font-semibold"
          style={{
            color: userGuess ? "var(--accent)" : "var(--ink-mute)",
            borderColor: userGuess ? "var(--accent)" : "var(--ink-soft)",
            minWidth: "60px",
          }}
        >
          {userGuess || "?"}
        </span>
      </div>

      {!revealed ? (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>
            Choose a word or type your own guess:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {currentExample.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleGuessSelect(opt)}
                className="rounded-[var(--r-sm)] px-3 py-1.5 text-xs font-medium border transition"
                style={{
                  background:
                    userGuess === opt
                      ? "color-mix(in srgb, var(--accent) 15%, var(--surface))"
                      : "var(--surface)",
                  borderColor: userGuess === opt ? "var(--accent)" : "var(--border)",
                  color: userGuess === opt ? "var(--accent)" : "var(--ink-soft)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomGuessSubmit} className="flex gap-2 mb-5">
            <input
              type="text"
              placeholder="Or type a custom word..."
              value={customGuess}
              onChange={(e) => setCustomGuess(e.target.value)}
              className="flex-1 rounded-[var(--r-sm)] border px-3 py-1.5 text-xs font-mono outline-none"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
            />
            <button
              type="submit"
              className="rounded-[var(--r-sm)] px-4 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--surface-strong)",
                color: "var(--ink)",
                border: "1px solid var(--border-strong)",
              }}
            >
              Lock Guess
            </button>
          </form>

          <button
            type="button"
            disabled={!userGuess}
            onClick={handleReveal}
            className="w-full rounded-[var(--r-md)] py-2.5 text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Check Model Predictions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Guess status */}
          <div
            className="rounded-[var(--r-sm)] p-3 text-xs leading-relaxed"
            style={{
              background: guessInLogits
                ? "color-mix(in srgb, var(--accent-2) 10%, var(--surface))"
                : "color-mix(in srgb, var(--warn) 8%, var(--surface))",
              border: `1px solid ${guessInLogits ? "var(--accent-2)" : "var(--warn)"}`,
            }}
          >
            {guessInLogits ? (
              <p style={{ color: "var(--ink)" }}>
                🎉{" "}
                <strong>
                  Your guess &apos;{userGuess}&apos; matches one of the LLM&apos;s predictions!
                </strong>{" "}
                It had a <strong>{(guessInLogits.probability * 100).toFixed(1)}%</strong>{" "}
                probability.
              </p>
            ) : (
              <p style={{ color: "var(--ink)" }}>
                🔍 Your guess &apos;{userGuess}&apos; was not in the model&apos;s top 5 predictions
                (probability &lt; 1%). Real language models compute scores for thousands of words
                before selecting one.
              </p>
            )}
          </div>

          {/* Bar Chart */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
              Model&apos;s Top 5 Predictions (Next-Token Probabilities):
            </p>
            <div className="space-y-2">
              {currentExample.logits.map((item) => {
                const isSelected = item.word.toLowerCase() === userGuess.toLowerCase();
                return (
                  <div key={item.word} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="flex items-center gap-1 font-semibold">
                        {item.word}
                        {isSelected && (
                          <Check className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                        )}
                      </span>
                      <span style={{ color: "var(--ink-soft)" }}>
                        {(item.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div
                      className="h-2.5 w-full rounded-full overflow-hidden"
                      style={{
                        background: "var(--surface-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.probability * 100}%`,
                          background: isSelected ? "var(--accent)" : "var(--accent-2)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-[var(--r-md)] py-2 text-xs font-semibold transition"
            style={{
              background: "var(--surface-strong)",
              color: "var(--ink)",
              border: "1px solid var(--border)",
            }}
          >
            Try Another Word
          </button>
        </div>
      )}
    </div>
  );
}
