"use client";

import { useEffect, useRef, useState } from "react";

let mermaidInitialized = false;

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "var(--font-inter), sans-serif",
            themeVariables: {
              background: "transparent",
              primaryColor: "#5b3fff",
              primaryTextColor: "#f2f3fb",
              lineColor: "#8b8fad",
            }
          });
          mermaidInitialized = true;
        }

        // Clean up text content to avoid html escape issues inside mermaid parser
        const cleanedChart = chart
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&");

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, cleanedChart);
        
        if (active) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        if (active) {
          setError(true);
        }
      }
    }

    renderDiagram();

    return () => {
      active = false;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded text-xs overflow-x-auto my-6">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center p-8 bg-surface-muted border rounded animate-pulse text-xs text-ink-mute my-6">
        Loading diagram...
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="mermaid-chart" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
