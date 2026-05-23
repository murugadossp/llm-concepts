"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({
  language,
  children,
}: {
  language?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);
  const code = String(children).trim();

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="glass-strong my-6 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ borderBottom: "1px solid var(--border)", color: "var(--ink-mute)" }}
      >
        <span>{language ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 hover:opacity-80"
          style={{ color: "var(--ink-soft)" }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-6" style={{ color: "var(--ink)" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
