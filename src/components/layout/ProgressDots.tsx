export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Section ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className="h-2 w-2 rounded-full"
          style={{
            background: index + 1 <= current ? "var(--accent)" : "var(--border-strong)",
          }}
        />
      ))}
    </div>
  );
}
