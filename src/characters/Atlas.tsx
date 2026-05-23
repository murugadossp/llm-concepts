export function Atlas({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-labelledby="atlas-title">
      <title id="atlas-title">Atlas the Agent</title>
      <circle cx="40" cy="28" r="14" fill="var(--surface-strong)" stroke="currentColor" strokeWidth="2" />
      <rect x="22" y="42" width="36" height="24" rx="10" fill="url(#atlas-fill)" stroke="currentColor" strokeWidth="2" />
      <defs>
        <linearGradient id="atlas-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <rect x="52" y="48" width="10" height="14" rx="3" fill="var(--surface-strong)" stroke="currentColor" />
      <rect x="18" y="48" width="10" height="14" rx="3" fill="var(--surface-strong)" stroke="currentColor" />
    </svg>
  );
}
