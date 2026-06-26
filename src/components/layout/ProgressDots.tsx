export function ProgressDots({ total, current }: { total: number; current: number }) {
  const steps = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-1.5" aria-label={`Section ${current} of ${total}`}>
      {steps.map((step) => (
        <span
          key={step}
          className="h-2 w-2 rounded-full"
          style={{
            background: step <= current ? "var(--accent)" : "var(--border-strong)",
          }}
        />
      ))}
    </div>
  );
}
