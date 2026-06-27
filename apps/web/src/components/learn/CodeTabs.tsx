"use client";

import { useState } from "react";
import { CodeBlock } from "./CodeBlock";

type Tab = {
  label: string;
  language: string;
  code: string;
};

export function CodeTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active] ?? tabs[0];

  if (!current) return null;

  return (
    <div className="my-6">
      <div className="mb-2 flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(index)}
            className="rounded-[var(--r-pill)] px-3 py-1.5 text-xs font-medium"
            style={{
              background: index === active ? "var(--accent)" : "var(--surface)",
              color: index === active ? "#fff" : "var(--ink-soft)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock language={current.language}>{current.code}</CodeBlock>
    </div>
  );
}
