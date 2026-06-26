const characterLabels: Record<string, string> = {
  Tess: "Tess the Token",
  Vector: "Vector the Embedding",
  Atlas: "Atlas the Agent",
  MCPMae: "MCP-Mae",
  SkillSam: "Skill-Sam",
  PlugPip: "Plug-Pip",
  Orchestrator: "The Orchestrator",
  Halu: "Halu the Hallucination",
};

export function PersonaStrip({ characters }: { characters: string[] }) {
  return (
    <div className="glass my-6 flex flex-wrap gap-2 px-4 py-3">
      {characters.map((name) => (
        <span
          key={name}
          className="rounded-[var(--r-pill)] border px-3 py-1 text-xs font-medium"
          style={{
            background: "var(--surface-muted)",
            borderColor: "var(--border)",
            color: "var(--ink-soft)",
          }}
        >
          {characterLabels[name] ?? name}
        </span>
      ))}
    </div>
  );
}
