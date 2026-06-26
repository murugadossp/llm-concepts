export function Vector({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      role="img"
      aria-labelledby="vector-title vector-desc"
    >
      <title id="vector-title">Vector the Embedding</title>
      <desc id="vector-desc">
        A geometric character made of coordinate axes and a glowing direction arrow.
      </desc>
      <defs>
        <linearGradient id="vector-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {/* Body: diamond */}
      <polygon
        points="40,8 70,40 40,72 10,40"
        fill="url(#vector-fill)"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Axes */}
      <line
        x1="40"
        y1="28"
        x2="40"
        y2="52"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="28"
        y1="40"
        x2="52"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Direction arrow (northeast) */}
      <line
        x1="40"
        y1="40"
        x2="54"
        y2="26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="54,26 46,27 53,34" fill="currentColor" />
      {/* Coordinate badge */}
      <rect
        x="24"
        y="58"
        width="32"
        height="8"
        rx="4"
        fill="var(--surface-strong)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
