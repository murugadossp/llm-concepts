"use client";

import { ArrowLeft, ArrowRight, Info, Pause, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

type PipelineStage = {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  svgRender: () => React.ReactNode;
};

const STAGES: PipelineStage[] = [
  {
    title: "1. Raw Input Text",
    subtitle: "User submits prompt",
    description:
      "The journey starts with a prompt written by a human. The model does not understand English letters or phrases directly; it needs a structured pipeline to translate text into numbers.",
    icon: "✍️",
    svgRender: () => (
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        role="img"
        aria-label="Raw Input Text Stage"
      >
        <title>Raw Input Text Stage</title>
        <rect
          x="10"
          y="15"
          width="80"
          height="30"
          rx="3"
          fill="var(--surface-muted)"
          stroke="var(--border)"
          strokeWidth="0.5"
        />
        <text x="15" y="27" fontSize="3.5" fill="var(--ink)" fontFamily="monospace">
          User Prompt:
        </text>
        <text
          x="15"
          y="36"
          fontSize="4.5"
          fill="var(--accent)"
          fontWeight="bold"
          fontFamily="monospace"
        >
          &quot;The chef cooked the soup...&quot;
        </text>
      </svg>
    ),
  },
  {
    title: "2. Tokenization",
    subtitle: "Text cut into chunks",
    description:
      "A tokenizer cuts the sentence into small pieces called tokens (which can be words, parts of words, or characters) and maps them to unique integers (Token IDs) using a learned vocabulary.",
    icon: "✂️",
    svgRender: () => (
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        role="img"
        aria-label="Tokenization Stage"
      >
        <title>Tokenization Stage</title>
        {/* Input tokens */}
        <g transform="translate(10, 15)">
          <rect
            x="0"
            y="0"
            width="16"
            height="12"
            rx="2"
            fill="color-mix(in srgb, var(--accent) 15%, transparent)"
            stroke="var(--accent)"
            strokeWidth="0.4"
          />
          <text
            x="8"
            y="7"
            fontSize="3"
            textAnchor="middle"
            fill="var(--ink)"
            fontWeight="bold"
            fontFamily="monospace"
          >
            The
          </text>
          <text
            x="8"
            y="16"
            fontSize="2.5"
            textAnchor="middle"
            fill="var(--ink-soft)"
            fontFamily="monospace"
          >
            #1053
          </text>
        </g>
        <g transform="translate(30, 15)">
          <rect
            x="0"
            y="0"
            width="16"
            height="12"
            rx="2"
            fill="color-mix(in srgb, var(--accent-2) 15%, transparent)"
            stroke="var(--accent-2)"
            strokeWidth="0.4"
          />
          <text
            x="8"
            y="7"
            fontSize="3"
            textAnchor="middle"
            fill="var(--ink)"
            fontWeight="bold"
            fontFamily="monospace"
          >
            chef
          </text>
          <text
            x="8"
            y="16"
            fontSize="2.5"
            textAnchor="middle"
            fill="var(--ink-soft)"
            fontFamily="monospace"
          >
            #8429
          </text>
        </g>
        <g transform="translate(50, 15)">
          <rect
            x="0"
            y="0"
            width="18"
            height="12"
            rx="2"
            fill="color-mix(in srgb, var(--accent) 15%, transparent)"
            stroke="var(--accent)"
            strokeWidth="0.4"
          />
          <text
            x="9"
            y="7"
            fontSize="3"
            textAnchor="middle"
            fill="var(--ink)"
            fontWeight="bold"
            fontFamily="monospace"
          >
            cooked
          </text>
          <text
            x="9"
            y="16"
            fontSize="2.5"
            textAnchor="middle"
            fill="var(--ink-soft)"
            fontFamily="monospace"
          >
            #11370
          </text>
        </g>
        <g transform="translate(72, 15)">
          <rect
            x="0"
            y="0"
            width="18"
            height="12"
            rx="2"
            fill="color-mix(in srgb, var(--sun) 15%, transparent)"
            stroke="var(--sun)"
            strokeWidth="0.4"
          />
          <text
            x="9"
            y="7"
            fontSize="3"
            textAnchor="middle"
            fill="var(--ink)"
            fontWeight="bold"
            fontFamily="monospace"
          >
            soup
          </text>
          <text
            x="9"
            y="16"
            fontSize="2.5"
            textAnchor="middle"
            fill="var(--ink-soft)"
            fontFamily="monospace"
          >
            #4722
          </text>
        </g>
        <path d="M 10 38 L 90 38" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="1 1" />
        <text x="50" y="46" fontSize="3" textAnchor="middle" fill="var(--ink-mute)">
          Tokenizer vocabulary converts text to a list of IDs.
        </text>
      </svg>
    ),
  },
  {
    title: "3. Embeddings Look-up",
    subtitle: "IDs become vectors",
    description:
      "Each token ID points to a learned embedding (a list of hundreds of floating-point numbers). This positions the token in a high-dimensional meaning-space, where geometrical distance indicates semantic similarity.",
    icon: "🗺️",
    svgRender: () => (
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        role="img"
        aria-label="Embeddings Lookup Stage"
      >
        <title>Embeddings Lookup Stage</title>
        {/* 2D grid mock */}
        <line x1="15" y1="10" x2="15" y2="45" stroke="var(--border)" strokeWidth="0.5" />
        <line x1="15" y1="45" x2="85" y2="45" stroke="var(--border)" strokeWidth="0.5" />
        {/* Points */}
        <circle cx="35" cy="20" r="1.5" fill="var(--accent)" />
        <text x="35" y="16" fontSize="2.5" textAnchor="middle" fill="var(--ink)">
          chef [0.2, 0.8]
        </text>

        <circle cx="68" cy="24" r="1.5" fill="var(--accent-2)" />
        <text x="68" y="20" fontSize="2.5" textAnchor="middle" fill="var(--ink)">
          soup [0.7, 0.6]
        </text>

        <circle cx="45" cy="40" r="1.5" fill="var(--sun)" />
        <text x="45" y="36" fontSize="2.5" textAnchor="middle" fill="var(--ink)">
          cooked [0.4, 0.2]
        </text>

        <text x="50" y="53" fontSize="2.5" textAnchor="middle" fill="var(--ink-mute)">
          High-dimensional coordinates representation.
        </text>
      </svg>
    ),
  },
  {
    title: "4. Self-Attention blocks",
    subtitle: "Tokens query surrounding context",
    description:
      "The core transformer block. Tokens exchange messages with one another using Query, Key, and Value mechanisms. This dynamically updates each token vector to represent context (e.g., knowing what 'it' refers to).",
    icon: "🧠",
    svgRender: () => (
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        role="img"
        aria-label="Self-Attention Stage"
      >
        <title>Self-Attention Stage</title>
        <text x="15" y="18" fontSize="3.5" fill="var(--ink)" fontFamily="monospace">
          chef
        </text>
        <text x="50" y="18" fontSize="3.5" fill="var(--ink)" fontFamily="monospace">
          cooked
        </text>
        <text x="80" y="18" fontSize="3.5" fill="var(--ink)" fontFamily="monospace">
          soup
        </text>

        {/* Attention connection lines */}
        <path
          d="M 23 20 Q 48 38 78 20"
          stroke="var(--accent)"
          strokeWidth="0.6"
          strokeDasharray="1.5 1"
        />
        <path d="M 23 20 Q 36 28 48 20" stroke="var(--accent-2)" strokeWidth="0.6" />
        <path d="M 52 20 Q 66 28 78 20" stroke="var(--accent-2)" strokeWidth="0.6" />

        <circle cx="23" cy="20" r="1" fill="var(--accent)" />
        <circle cx="50" cy="20" r="1" fill="var(--accent-2)" />
        <circle cx="80" cy="20" r="1" fill="var(--accent-2)" />

        <text x="50" y="48" fontSize="3" textAnchor="middle" fill="var(--ink-soft)">
          Tokens blend meanings based on attention query matches.
        </text>
      </svg>
    ),
  },
  {
    title: "5. Logits Calculation",
    subtitle: "Vocabulary scores generated",
    description:
      "The contextualized vectors pass through a final LayerNorm and Linear projection layer, generating raw scores (logits) for all possible words in the model's vocabulary. Higher scores mean more likely continuations.",
    icon: "📊",
    svgRender: () => (
      <svg viewBox="0 0 100 60" className="w-full h-full" role="img" aria-label="Logits Stage">
        <title>Logits Stage</title>
        <text x="10" y="15" fontSize="3" fill="var(--ink)" fontFamily="monospace">
          Logit scores (Vocabulary):
        </text>
        <g transform="translate(10, 22)">
          <text x="0" y="3" fontSize="2.8" fill="var(--ink)" fontFamily="monospace">
            because
          </text>
          <rect x="25" y="0" width="50" height="4" rx="0.5" fill="var(--accent)" />
          <text x="80" y="3.5" fontSize="2.8" fill="var(--ink-soft)" fontFamily="monospace">
            9.8
          </text>
        </g>
        <g transform="translate(10, 30)">
          <rect x="25" y="0" width="20" height="4" rx="0.5" fill="var(--accent-2)" />
          <text x="0" y="3" fontSize="2.8" fill="var(--ink)" fontFamily="monospace">
            and
          </text>
          <text x="50" y="3.5" fontSize="2.8" fill="var(--ink-soft)" fontFamily="monospace">
            4.2
          </text>
        </g>
        <g transform="translate(10, 38)">
          <rect
            x="25"
            y="0"
            width="5"
            height="4"
            rx="0.5"
            fill="color-mix(in srgb, var(--ink) 25%, transparent)"
          />
          <text x="0" y="3" fontSize="2.8" fill="var(--ink)" fontFamily="monospace">
            soup
          </text>
          <text x="35" y="3.5" fontSize="2.8" fill="var(--ink-soft)" fontFamily="monospace">
            1.1
          </text>
        </g>
      </svg>
    ),
  },
  {
    title: "6. Sampling & Choice",
    subtitle: "Final token is chosen",
    description:
      "Sampling parameters (like temperature, top-p, and top-k) convert raw logits into actual probabilities, filtering out bad options. A random roll picks the final token, which is fed back into the input for the next cycle.",
    icon: "🎲",
    svgRender: () => (
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        role="img"
        aria-label="Sampling &amp; Choice Stage"
      >
        <title>Sampling &amp; Choice Stage</title>
        {/* Selection Wheel */}
        <circle cx="50" cy="25" r="16" fill="none" stroke="var(--border)" strokeWidth="0.5" />
        <path
          d="M 50 25 L 50 9 A 16 16 0 0 1 64.5 32 Z"
          fill="color-mix(in srgb, var(--accent) 30%, transparent)"
          stroke="var(--accent)"
          strokeWidth="0.4"
        />
        <path
          d="M 50 25 L 64.5 32 A 16 16 0 0 1 35.5 32 Z"
          fill="color-mix(in srgb, var(--accent-2) 30%, transparent)"
          stroke="var(--accent-2)"
          strokeWidth="0.4"
        />
        <text x="50" y="27" fontSize="3" textAnchor="middle" fill="var(--ink)" fontWeight="bold">
          Rolling Dice
        </text>

        <path d="M 50 6 L 50 12" stroke="var(--warn)" strokeWidth="1" />
        <text
          x="50"
          y="50"
          fontSize="3.5"
          textAnchor="middle"
          fill="var(--accent)"
          fontWeight="bold"
          fontFamily="monospace"
        >
          Selected Token: &quot;because&quot; (62%)
        </text>
      </svg>
    ),
  },
];

export function PipelineDiagram() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % STAGES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  function handleNext() {
    setIsPlaying(false);
    setActiveStage((prev) => (prev + 1) % STAGES.length);
  }

  function handlePrev() {
    setIsPlaying(false);
    setActiveStage((prev) => (prev - 1 + STAGES.length) % STAGES.length);
  }

  const currentStage = (STAGES[activeStage] ?? STAGES[0]) as PipelineStage;

  return (
    <div className="glass my-8 p-5">
      <div
        className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 mb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Capstone: Transformer Pipeline Cycle
        </h4>
        <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
          The complete journey of a single text generation step
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stage Timeline Navigation */}
        <div className="md:col-span-1 space-y-2">
          {STAGES.map((s, idx) => (
            <button
              key={s.title}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setActiveStage(idx);
              }}
              className="w-full text-left rounded-[var(--r-sm)] p-2.5 text-xs transition border flex items-center gap-2"
              style={{
                background: idx === activeStage ? "var(--surface-hover)" : "var(--surface)",
                borderColor: idx === activeStage ? "var(--accent)" : "var(--border)",
                color: idx === activeStage ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: idx === activeStage ? 600 : 400,
              }}
            >
              <span className="text-base shrink-0">{s.icon}</span>
              <div>
                <div>{s.title}</div>
                <div
                  className="text-[10px]"
                  style={{ color: "var(--ink-mute)", fontWeight: "normal" }}
                >
                  {s.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Display Panel */}
        <div
          className="md:col-span-2 flex flex-col justify-between border rounded-[var(--r-md)] p-5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span
                className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
              >
                Step {activeStage + 1} of 6
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full hover:bg-[var(--surface-hover)] transition"
                  title={isPlaying ? "Pause auto-advance" : "Auto-advance stages"}
                  style={{ color: "var(--ink-soft)" }}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Display Graphic */}
            <div
              className="rounded-[var(--r-sm)] border overflow-hidden flex items-center justify-center p-2"
              style={{
                background: "var(--surface-muted)",
                borderColor: "var(--border)",
                aspectRatio: "1.8/1",
              }}
            >
              {currentStage.svgRender()}
            </div>

            {/* Description Text */}
            <div className="space-y-1">
              <h5 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                {currentStage.title}
              </h5>
              <p className="text-xs leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {currentStage.description}
              </p>
            </div>
          </div>

          {/* Stepper buttons */}
          <div
            className="flex justify-between pt-4 mt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 rounded-[var(--r-sm)] px-3 py-1.5 text-xs font-semibold transition border hover:bg-[var(--surface-hover)]"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink-soft)",
              }}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-[var(--r-sm)] px-3 py-1.5 text-xs font-semibold transition border hover:bg-[var(--surface-hover)]"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink-soft)",
              }}
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-5 flex gap-2 rounded-[var(--r-sm)] px-3 py-2 text-xs items-start"
        style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <span>
          <strong>The Token Loop:</strong> Once a token is selected in Stage 6, it is appended to
          the prompt, and the model starts the entire cycle again to predict the next token. This
          repeats until a special stop token (e.g. <code>&lt;eos&gt;</code>) is generated.
        </span>
      </div>
    </div>
  );
}
