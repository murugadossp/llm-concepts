export function MCPMae({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-labelledby="mae-title">
      <title id="mae-title">MCP-Mae</title>
      <rect
        x="12"
        y="18"
        width="56"
        height="44"
        rx="12"
        fill="var(--surface-strong)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="28" cy="36" r="5" fill="var(--accent)" />
      <circle cx="40" cy="36" r="5" fill="var(--accent-2)" />
      <circle cx="52" cy="36" r="5" fill="var(--sun)" />
      <path d="M20 52 H60" stroke="currentColor" strokeWidth="2" />
      <path d="M8 40 C4 40 4 48 8 48" fill="none" stroke="var(--accent-2)" strokeWidth="2" />
      <path d="M72 40 C76 40 76 48 72 48" fill="none" stroke="var(--accent)" strokeWidth="2" />
    </svg>
  );
}
