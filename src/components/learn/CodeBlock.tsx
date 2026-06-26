"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

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
    <div
      className="my-6 overflow-hidden rounded-[var(--r-md)] border"
      style={{ background: "var(--code-bg)", borderColor: "var(--border-strong)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ borderBottom: "1px solid var(--border-strong)", color: "var(--code-mute)" }}
      >
        <span>{language ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 hover:opacity-80"
          style={{ color: "var(--code-ink)" }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="overflow-x-auto p-5 font-mono text-sm leading-6"
        style={{ color: "var(--code-ink)" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
