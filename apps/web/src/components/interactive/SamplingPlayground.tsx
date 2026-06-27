"use client";

import { Sparkles, RefreshCw, Info } from "lucide-react";
import { useMemo, useState } from "react";

type CandidateToken = {
  word: string;
  baseProb: number;
};

type ComputedCandidate = {
  word: string;
  prob: number;
  isActive: boolean;
  reason: string;
  finalProb: number;
};

const BASE_CANDIDATES: CandidateToken[] = [
  { word: "the", baseProb: 0.45 },
  { word: "a", baseProb: 0.22 },
  { word: "an", baseProb: 0.15 },
  { word: "some", baseProb: 0.1 },
  { word: "one", baseProb: 0.06 },
  { word: "dog", baseProb: 0.02 },
];

export function SamplingPlayground() {
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [topK, setTopK] = useState(5);
  const [generatedText, setGeneratedText] = useState("A model reads");

  // Calculate adjusted probabilities based on temperature, top-p, and top-k
  const computedCandidates = useMemo<ComputedCandidate[]>(() => {
    // 1. Temperature adjustment: prob = exp(log(baseProb) / temp)
    // Avoid division by zero: temp = 0 is a special case
    let adjusted = BASE_CANDIDATES.map((c) => {
      if (temperature <= 0.05) {
        // Greedy sampling: the highest gets 1, others 0
        return {
          word: c.word,
          prob: c.word === "the" ? 1.0 : 0.0,
          isActive: true,
          reason: "",
          finalProb: 0,
        };
      }
      const rawLog = Math.log(c.baseProb);
      return {
        word: c.word,
        prob: Math.exp(rawLog / temperature),
        isActive: true,
        reason: "",
        finalProb: 0,
      };
    });

    // Normalize after temperature scaling
    const tempSum = adjusted.reduce((acc, c) => acc + c.prob, 0);
    adjusted = adjusted.map((c) => ({
      ...c,
      prob: tempSum > 0 ? c.prob / tempSum : 0,
    }));

    // Sort by adjusted probability descending
    adjusted.sort((a, b) => b.prob - a.prob);

    // 2. Top-k filter
    adjusted = adjusted.map((c, idx) => {
      if (idx >= topK) {
        return { ...c, isActive: false, reason: "Excluded by Top-K" };
      }
      return c;
    });

    // 3. Top-p (Nucleus) filter
    let cumulativeProb = 0;
    let cutoffReached = false;
    adjusted = adjusted.map((c) => {
      if (!c.isActive) return c;
      if (cutoffReached) {
        return { ...c, isActive: false, reason: "Excluded by Top-P" };
      }
      cumulativeProb += c.prob;
      if (cumulativeProb > topP) {
        cutoffReached = true;
      }
      return c;
    });

    // Normalize active probabilities so they sum to 1
    const activeSum = adjusted.reduce((acc, c) => acc + (c.isActive ? c.prob : 0), 0);
    adjusted = adjusted.map((c) => {
      if (c.isActive) {
        return { ...c, finalProb: activeSum > 0 ? c.prob / activeSum : 0 };
      }
      return { ...c, finalProb: 0 };
    });

    return adjusted;
  }, [temperature, topP, topK]);

  function handleGenerateToken() {
    // Filter active items
    const actives = computedCandidates.filter((c) => c.isActive && c.finalProb > 0);
    if (actives.length === 0) return;

    // Roll a random number between 0 and 1
    const rand = Math.random();
    let cumulative = 0;
    let selectedWord = actives[0]?.word ?? "the";

    for (const c of actives) {
      cumulative += c.finalProb;
      if (rand <= cumulative) {
        selectedWord = c.word;
        break;
      }
    }

    setGeneratedText((prev) => `${prev} ${selectedWord}`);
  }

  function handleClearText() {
    setGeneratedText("A model reads");
  }

  return (
    <div className="glass my-8 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 mb-4" style={{ borderColor: "var(--border)" }}>
        <h4 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Interactive Sampling Playground
        </h4>
        <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
          Tune creativity using temperature, Top-P, and Top-K
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Slider Panel */}
        <div className="space-y-4">
          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span style={{ color: "var(--ink)" }}>Temperature (Randomness)</span>
              <strong style={{ color: "var(--accent)" }}>{temperature.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <p className="text-[10px]" style={{ color: "var(--ink-mute)" }}>
              0 = Greedy (highly predictable); 0.7 = standard; 1.5+ = highly creative/chaotic.
            </p>
          </div>

          {/* Top-P */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span style={{ color: "var(--ink)" }}>Top-P (Nucleus Sampling)</span>
              <strong style={{ color: "var(--accent-2)" }}>{topP.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent-2)]"
            />
            <p className="text-[10px]" style={{ color: "var(--ink-mute)" }}>
              Filters candidates to only keep the top words whose cumulative probability hits P.
            </p>
          </div>

          {/* Top-K */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span style={{ color: "var(--ink)" }}>Top-K (Count Filter)</span>
              <strong style={{ color: "var(--sun)" }}>{topK}</strong>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full accent-[var(--sun)]"
            />
            <p className="text-[10px]" style={{ color: "var(--ink-mute)" }}>
              Restricts the choice pool to the top K most likely words, cutting off the rest.
            </p>
          </div>
        </div>

        {/* Right Candidate list & Output */}
        <div className="space-y-4">
          <p className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>Candidate Token Pool:</p>
          <div className="space-y-2">
            {computedCandidates.map((c) => (
              <div
                key={c.word}
                className="p-2 rounded-[var(--r-sm)] border text-xs flex items-center justify-between transition-opacity"
                style={{
                  background: c.isActive ? "var(--surface)" : "var(--surface-muted)",
                  borderColor: "var(--border)",
                  opacity: c.isActive ? 1.0 : 0.45,
                }}
              >
                <span className="font-mono font-semibold" style={{ color: c.isActive ? "var(--ink)" : "var(--ink-mute)" }}>
                  {c.word}
                </span>
                <div className="flex items-center gap-3">
                  {c.isActive ? (
                    <span className="font-mono" style={{ color: "var(--accent-2)" }}>
                      {(c.finalProb * 100).toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold italic" style={{ color: "var(--warn)" }}>
                      {c.reason}
                    </span>
                  )}
                  <div
                    className="h-2 w-16 rounded-full overflow-hidden"
                    style={{ background: "var(--surface-muted)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(c.isActive ? c.finalProb : 0) * 100}%`,
                        background: "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generated output box */}
      <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex justify-between items-center mb-2 text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
          <span>Generated Text Output:</span>
          <button type="button" onClick={handleClearText} className="flex items-center gap-1 font-semibold hover:opacity-80" style={{ color: "var(--ink-soft)" }}>
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div
          className="rounded-[var(--r-md)] p-4 font-mono text-sm leading-relaxed min-h-[50px] mb-3"
          style={{ background: "var(--surface-muted)", border: "1px solid var(--border)", color: "var(--ink)" }}
        >
          {generatedText}
          <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse" />
        </div>
        <button
          type="button"
          onClick={handleGenerateToken}
          className="w-full rounded-[var(--r-md)] py-2 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" /> Generate Next Word
        </button>
      </div>

      <div
        className="mt-5 flex gap-2 rounded-[var(--r-sm)] px-3 py-2 text-xs items-start"
        style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <span>
          <strong>Try it:</strong> Set temperature to <code>0</code> (greedy) to see how generating is 100% deterministic (it will only pick &quot;the&quot;). Pump temperature to <code>2.0</code> to watch the probabilities flatten out, giving lower-probability words like &quot;dog&quot; a fighting chance!
        </span>
      </div>
    </div>
  );
}
