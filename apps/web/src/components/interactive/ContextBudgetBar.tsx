"use client";

import { AlertTriangle, Info, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type BudgetItem = {
  id: string;
  label: string;
  size: number; // in tokens
  color: string;
  description: string;
};

const INITIAL_ITEMS: BudgetItem[] = [
  {
    id: "system",
    label: "System Instructions",
    size: 150,
    color: "var(--accent)",
    description: "Global instructions setting the model's persona and safety rules.",
  },
  {
    id: "user",
    label: "Current User Query",
    size: 50,
    color: "var(--accent-2)",
    description: "The prompt typed by the user in the input box.",
  },
];

const AVAILABLE_ITEMS: BudgetItem[] = [
  {
    id: "rag",
    label: "Retrieved Knowledge (RAG)",
    size: 550,
    color: "var(--sun)",
    description: "Relevant snippets pulled from external databases/documentation.",
  },
  {
    id: "history",
    label: "Conversation History",
    size: 350,
    color: "color-mix(in srgb, var(--ink) 45%, transparent)",
    description: "Recent back-and-forth messages for context continuity.",
  },
  {
    id: "tools",
    label: "Tool / API Outputs",
    size: 200,
    color: "var(--warn)",
    description: "Raw data returned from system functions or database calls.",
  },
];

export function ContextBudgetBar() {
  const [budgetLimit] = useState(1000); // 1000 tokens maximum for visual demo
  const [activeItems, setActiveItems] = useState<BudgetItem[]>(INITIAL_ITEMS);

  const totalTokens = activeItems.reduce((acc, item) => acc + item.size, 0);
  const isOverflow = totalTokens > budgetLimit;

  // Cost estimates: $0.15 per 1M input tokens example
  const inputCost = (totalTokens / 1_000_000) * 0.15;

  function addItem(item: BudgetItem) {
    if (activeItems.some((i) => i.id === item.id)) return;
    setActiveItems((prev) => [...prev, item]);
  }

  function removeItem(id: string) {
    setActiveItems((prev) => prev.filter((item) => item.id !== id));
  }

  const unusedItems = AVAILABLE_ITEMS.filter((item) => !activeItems.some((i) => i.id === item.id));

  return (
    <div className="glass my-8 p-5">
      <div
        className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 mb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Interactive Context Budget Simulator
        </h4>
        <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
          Manage what gets stuffed onto the LLM&apos;s desk
        </span>
      </div>

      <div className="space-y-6">
        {/* Visual Budget Bar */}
        <div>
          <div
            className="flex justify-between text-xs font-semibold mb-2"
            style={{ color: "var(--ink-soft)" }}
          >
            <span>
              Context Load: <strong>{totalTokens}</strong> / {budgetLimit} tokens
            </span>
            <span style={{ color: isOverflow ? "var(--warn)" : "var(--accent-2)" }}>
              {isOverflow ? "⚠️ Context Overflow!" : "✅ Safe Capacity"}
            </span>
          </div>

          <div
            className="h-7 w-full rounded-[var(--r-sm)] overflow-hidden flex border"
            style={{
              background: "var(--surface-muted)",
              borderColor: "var(--border)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {activeItems.map((item) => {
              // Calculate width proportional to limit
              const percentage = Math.min((item.size / budgetLimit) * 100, 100);
              return (
                <div
                  key={item.id}
                  className="h-full relative group transition-all duration-300 first:rounded-l-[var(--r-sm)] last:rounded-r-[var(--r-sm)]"
                  style={{
                    width: `${percentage}%`,
                    background: item.color,
                  }}
                  title={`${item.label} (${item.size} tokens)`}
                />
              );
            })}
          </div>
        </div>

        {/* Legend & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
              Active Context Items:
            </h5>
            <div className="space-y-2">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-[var(--r-sm)] border text-xs"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ background: item.color }}
                    />
                    <div>
                      <strong style={{ color: "var(--ink)" }}>{item.label}</strong>
                      <span
                        className="ml-2 font-mono text-[10px]"
                        style={{ color: "var(--ink-mute)" }}
                      >
                        {item.size} tokens
                      </span>
                    </div>
                  </div>
                  {item.id !== "system" && item.id !== "user" ? (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded transition hover:bg-[var(--surface-hover)]"
                      style={{ color: "var(--warn)" }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <span
                      className="text-[10px] font-semibold tracking-wider uppercase px-1 rounded"
                      style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
                    >
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>

            {unusedItems.length > 0 && (
              <div className="pt-2">
                <h5 className="text-xs font-semibold mb-2" style={{ color: "var(--ink)" }}>
                  Add Optional context:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {unusedItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addItem(item)}
                      className="rounded-[var(--r-pill)] border px-3 py-1 text-xs font-semibold transition hover:bg-[var(--surface-hover)] flex items-center gap-1"
                      style={{
                        background: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--ink-soft)",
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                      {item.label} (+{item.size}t)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Info / Explanations */}
          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              {isOverflow ? (
                <div
                  className="rounded-[var(--r-sm)] p-4 border text-xs leading-relaxed flex gap-2"
                  style={{
                    background: "color-mix(in srgb, var(--warn) 8%, var(--surface))",
                    borderColor: "var(--warn)",
                  }}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "var(--warn)" }} />
                  <div>
                    <h6 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                      Overflow Alert!
                    </h6>
                    <p style={{ color: "var(--ink-soft)" }}>
                      With <strong>{totalTokens}</strong> tokens, you have exceeded the desk space.
                      The model will fail to process, throw an error, or drop older conversation
                      history.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-[var(--r-sm)] p-4 border text-xs leading-relaxed"
                  style={{
                    background: "color-mix(in srgb, var(--accent-2) 6%, var(--surface))",
                    borderColor: "var(--border)",
                  }}
                >
                  <h6 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                    Capacity Insights:
                  </h6>
                  <p style={{ color: "var(--ink-soft)" }}>
                    You have <strong>{budgetLimit - totalTokens}</strong> tokens of free capacity.
                    This space can be used for new assistant outputs or larger RAG context.
                  </p>
                </div>
              )}

              <div
                className="rounded-[var(--r-sm)] p-3 text-xs space-y-1"
                style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
              >
                <div className="flex justify-between">
                  <span>Input Token count:</span>
                  <strong style={{ color: "var(--ink)" }}>{totalTokens}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Cost per Call:</span>
                  <strong style={{ color: "var(--accent)" }}>${inputCost.toFixed(6)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-5 flex gap-2 rounded-[var(--r-sm)] px-3 py-2 text-xs items-start"
        style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <span>
          <strong>Why this matters:</strong> Developers constantly balance token budgets. If you
          overload context with huge documents, you reduce model speed, spike billing cost, and
          create &quot;needle-in-a-haystack&quot; issues where the model misses details.
        </span>
      </div>
    </div>
  );
}
