"use client";

import { HelpCircle, Info } from "lucide-react";
import { useState } from "react";

type VectorPoint = {
  word: string;
  x: number; // 0 to 100 for SVG placement
  y: number; // 0 to 100 for SVG placement
  category: "royalty" | "gender" | "animals" | "fruits";
};

const POINTS: VectorPoint[] = [
  // Royalty
  { word: "king", x: 25, y: 30, category: "royalty" },
  { word: "queen", x: 65, y: 35, category: "royalty" },
  // Gender bases
  { word: "man", x: 20, y: 75, category: "gender" },
  { word: "woman", x: 60, y: 80, category: "gender" },
  // Animals
  { word: "dog", x: 80, y: 15, category: "animals" },
  { word: "cat", x: 90, y: 25, category: "animals" },
  // Fruits
  { word: "apple", x: 10, y: 15, category: "fruits" },
  { word: "banana", x: 15, y: 25, category: "fruits" },
];

const DEFAULT_KING = { word: "king", x: 25, y: 30, category: "royalty" as const };
const DEFAULT_QUEEN = { word: "queen", x: 65, y: 35, category: "royalty" as const };
const DEFAULT_MAN = { word: "man", x: 20, y: 75, category: "gender" as const };
const DEFAULT_WOMAN = { word: "woman", x: 60, y: 80, category: "gender" as const };

export function EmbeddingsMap() {
  const [selectedWord1, setSelectedWord1] = useState<string>("king");
  const [selectedWord2, setSelectedWord2] = useState<string>("man");
  const [showMathAnimation, setShowMathAnimation] = useState(false);

  const word1Obj = POINTS.find((p) => p.word === selectedWord1);
  const word2Obj = POINTS.find((p) => p.word === selectedWord2);

  // Compute mock cosine similarity based on geometric distance
  let similarity = 0;
  if (word1Obj && word2Obj) {
    const dx = word1Obj.x - word2Obj.x;
    const dy = word1Obj.y - word2Obj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Map max distance (~100) to 0, 0 distance to 1
    similarity = Math.max(0, 1 - dist / 110);
  }

  function handleWordClick(word: string) {
    if (showMathAnimation) return;
    if (selectedWord1 === word) return; // ignore clicking same
    if (selectedWord2 === word) {
      // Swap or clear
      setSelectedWord2(selectedWord1);
      setSelectedWord1(word);
      return;
    }
    // Shift word1 to word2, set clicked as word1
    setSelectedWord2(selectedWord1);
    setSelectedWord1(word);
  }

  function runMathAnimation() {
    setSelectedWord1("king");
    setSelectedWord2("queen");
    setShowMathAnimation(true);
  }

  const king = POINTS.find((p) => p.word === "king") ?? DEFAULT_KING;
  const queen = POINTS.find((p) => p.word === "queen") ?? DEFAULT_QUEEN;
  const man = POINTS.find((p) => p.word === "man") ?? DEFAULT_MAN;
  const woman = POINTS.find((p) => p.word === "woman") ?? DEFAULT_WOMAN;

  return (
    <div className="glass my-8 p-5">
      <div
        className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 mb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Interactive Embeddings Space
        </h4>
        <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
          Geometric representation of word meanings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Control Panel */}
        <div className="space-y-4 md:col-span-1">
          <p className="text-xs leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            Click words on the map to compare their semantic distance. Similar meanings stay close.
          </p>

          <div
            className="rounded-[var(--r-sm)] p-3 text-xs space-y-2"
            style={{ background: "var(--surface-muted)", border: "1px solid var(--border)" }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--ink-mute)" }}>Word 1:</span>
              <strong style={{ color: "var(--accent)" }}>{selectedWord1}</strong>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--ink-mute)" }}>Word 2:</span>
              <strong style={{ color: "var(--accent-2)" }}>{selectedWord2}</strong>
            </div>
            <div
              className="border-t pt-2 mt-2 flex justify-between items-center"
              style={{ borderColor: "var(--border)" }}
            >
              <span style={{ color: "var(--ink-soft)", fontWeight: 600 }}>
                Semantic Similarity:
              </span>
              <strong
                className="text-sm"
                style={{
                  color:
                    similarity > 0.8
                      ? "var(--accent-2)"
                      : similarity > 0.5
                        ? "var(--sun)"
                        : "var(--ink-mute)",
                }}
              >
                {(similarity * 100).toFixed(0)}%
              </strong>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={runMathAnimation}
              className="w-full rounded-[var(--r-sm)] py-2 text-xs font-semibold transition"
              style={{
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              Run Vector Math: King - Man + Woman
            </button>
            {showMathAnimation && (
              <button
                type="button"
                onClick={() => setShowMathAnimation(false)}
                className="w-full rounded-[var(--r-sm)] py-1.5 text-xs transition"
                style={{
                  background: "var(--surface-strong)",
                  color: "var(--ink-soft)",
                  border: "1px solid var(--border)",
                }}
              >
                Reset Math View
              </button>
            )}
          </div>
        </div>

        {/* Right Map View */}
        <div className="md:col-span-2 relative">
          <div
            className="rounded-[var(--r-md)] border overflow-hidden relative"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              aspectRatio: "4/3",
            }}
          >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  color: "var(--ink)",
                }}
              />
            </div>

            {/* SVG Render */}
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full select-none"
              role="img"
              aria-label="Embeddings Space 2D Word Map"
            >
              <title>Embeddings Space 2D Word Map</title>
              {/* Draw distance connection line */}
              {!showMathAnimation && word1Obj && word2Obj && word1Obj.word !== word2Obj.word && (
                <line
                  x1={word1Obj.x}
                  y1={word1Obj.y * 0.8} // scaled y
                  x2={word2Obj.x}
                  y2={word2Obj.y * 0.8}
                  stroke="var(--accent)"
                  strokeWidth="0.8"
                  strokeDasharray="1.5 1"
                  className="animate-[dash_2s_linear_infinite]"
                />
              )}

              {/* Vector Algebra Drawing */}
              {showMathAnimation && (
                <>
                  {/* Vector King to Man: King - Man */}
                  <line
                    x1={king.x}
                    y1={king.y * 0.8}
                    x2={man.x}
                    y2={man.y * 0.8}
                    stroke="var(--warn)"
                    strokeWidth="0.8"
                    markerEnd="url(#arrow-red)"
                  />
                  <text
                    x={(king.x + man.x) / 2 - 5}
                    y={((king.y + man.y) / 2) * 0.8 - 2}
                    fontSize="2.5"
                    fill="var(--warn)"
                    fontWeight="bold"
                  >
                    - Man
                  </text>

                  {/* Parallel translation vector (Woman - Man direction added to King) */}
                  {/* Landing point: King + (Woman - Man) = [25 + (60 - 20), 30 + (80 - 75)] = [65, 35] (exactly queen!) */}
                  <line
                    x1={man.x}
                    y1={man.y * 0.8}
                    x2={woman.x}
                    y2={woman.y * 0.8}
                    stroke="var(--accent-2)"
                    strokeWidth="0.8"
                    markerEnd="url(#arrow-green)"
                  />
                  <line
                    x1={man.x}
                    y1={man.y * 0.8}
                    x2={queen.x} // parallel vector from man to queen
                    y2={queen.y * 0.8}
                    stroke="var(--accent-2)"
                    strokeWidth="0.8"
                    strokeDasharray="1 1"
                  />
                  <text
                    x={(man.x + woman.x) / 2 - 5}
                    y={((man.y + woman.y) / 2) * 0.8 + 4}
                    fontSize="2.5"
                    fill="var(--accent-2)"
                    fontWeight="bold"
                  >
                    + Woman
                  </text>

                  {/* Landing indicator at Queen */}
                  <circle
                    cx={queen.x}
                    cy={queen.y * 0.8}
                    r="4"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="0.4"
                    className="animate-ping"
                  />
                </>
              )}

              {/* Definitions of markers */}
              <defs>
                <marker
                  id="arrow-red"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="3"
                  markerHeight="3"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 2 L 10 5 L 0 8 z" fill="var(--warn)" />
                </marker>
                <marker
                  id="arrow-green"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="3"
                  markerHeight="3"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 2 L 10 5 L 0 8 z" fill="var(--accent-2)" />
                </marker>
              </defs>

              {/* Draw points */}
              {POINTS.map((pt) => {
                const isSelected1 = !showMathAnimation && pt.word === selectedWord1;
                const isSelected2 = !showMathAnimation && pt.word === selectedWord2;
                const isMathTarget =
                  showMathAnimation && ["king", "queen", "man", "woman"].includes(pt.word);

                let color = "var(--ink-mute)";
                if (isSelected1) color = "var(--accent)";
                else if (isSelected2) color = "var(--accent-2)";
                else if (showMathAnimation) {
                  if (pt.word === "king") color = "var(--accent)";
                  else if (pt.word === "queen") color = "var(--accent-2)";
                  else if (pt.word === "man" || pt.word === "woman") color = "var(--ink)";
                }

                return (
                  <g
                    key={pt.word}
                    transform={`translate(${pt.x}, ${pt.y * 0.8})`}
                    className="cursor-pointer group outline-none"
                    // biome-ignore lint/a11y/useSemanticElements: SVG group acts as button
                    role="button"
                    tabIndex={0}
                    onClick={() => handleWordClick(pt.word)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleWordClick(pt.word);
                      }
                    }}
                  >
                    <circle
                      r={isSelected1 || isSelected2 || isMathTarget ? 2.5 : 1.5}
                      fill={color}
                      className="transition-all duration-300 group-hover:scale-125"
                      style={{
                        filter:
                          isSelected1 || isSelected2 || isMathTarget
                            ? "drop-shadow(0 0 2px var(--accent))"
                            : "none",
                      }}
                    />
                    <text
                      y="-3"
                      textAnchor="middle"
                      fontSize="3"
                      fontWeight={isSelected1 || isSelected2 || isMathTarget ? "bold" : "normal"}
                      fill="var(--ink)"
                      className="font-mono pointer-events-none transition-all duration-300 group-hover:font-bold"
                    >
                      {pt.word}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex gap-2 rounded-[var(--r-sm)] px-3 py-2 text-xs items-start"
        style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <span>
          <strong>Vector math concept:</strong> In embeddings space, relationships hold geometric
          meaning. Adding the difference vector of <code>woman − man</code> to <code>king</code>{" "}
          naturally outputs coordinates very close to <code>queen</code>!
        </span>
      </div>
    </div>
  );
}
