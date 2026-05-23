export function Tess({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      role="img"
      aria-labelledby="tess-title tess-desc"
    >
      <title id="tess-title">Tess the Token</title>
      <desc id="tess-desc">A rounded glass square character holding a text snippet.</desc>
      <defs>
        <linearGradient id="tess-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="60" height="60" rx="16" fill="url(#tess-fill)" stroke="currentColor" strokeWidth="2" />
      <circle cx="30" cy="34" r="4" fill="currentColor" />
      <circle cx="50" cy="34" r="4" fill="currentColor" />
      <path d="M28 48 Q40 56 52 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="24" y="58" width="32" height="8" rx="4" fill="var(--surface-strong)" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
