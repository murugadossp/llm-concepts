import Link from "next/link";

export function Paywall({
  reason,
  chapterSlug,
}: {
  reason: "signin" | "upgrade";
  chapterSlug: string;
}) {
  return (
    <div className="glass-strong my-8 p-8 text-center">
      <p className="font-display text-xl font-semibold" style={{ color: "var(--ink)" }}>
        {reason === "signin" ? "Sign in to continue" : "Upgrade to Pro"}
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
        Chapter {chapterSlug} is part of the Pro tier in Milestone 2.
      </p>
      <Link
        href="/pricing"
        className="mt-6 inline-flex rounded-[var(--r-pill)] px-5 py-2.5 text-sm font-semibold"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        View plans
      </Link>
    </div>
  );
}
