export function SiteFooter() {
  return (
    <footer className="mt-20 border-t py-9" style={{ borderColor: "var(--border)" }}>
      <div className="site-container flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-[13px]" style={{ color: "var(--ink-mute)" }}>
          Interactive learning from tokens to agents — by Murugadoss.
        </p>
        <span
          className="comic-dialogue inline-block -rotate-2 text-xl"
          style={{ color: "var(--accent)" }}
        >
          Learn by building.
        </span>
      </div>
    </footer>
  );
}
