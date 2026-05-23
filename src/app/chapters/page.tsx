import Link from "next/link";

const chapters = [
  {
    slug: "01-foundations",
    title: "Foundations: Tokens, Embeddings, Attention",
    teaser: "What tokens are, why embeddings matter, and how attention works.",
    minutes: 12,
    difficulty: "Beginner",
    tier: "Free",
  },
];

export default function ChaptersHubPage() {
  return (
    <div className="mx-auto w-[min(100%-2rem,var(--maxw-wide))] px-4 py-10">
      <h1 className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
        Chapters
      </h1>
      <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
        Flagship lessons ship first. More chapters follow the BLUEPRINT build order.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {chapters.map((ch) => (
          <li key={ch.slug}>
            <Link href={`/chapters/${ch.slug}`} className="glass block h-full p-6 transition hover:opacity-95">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                {ch.tier} · {ch.difficulty}
              </span>
              <h2 className="font-display mt-2 text-xl font-semibold" style={{ color: "var(--ink)" }}>
                {ch.title}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                {ch.teaser}
              </p>
              <p className="mt-4 text-xs" style={{ color: "var(--ink-mute)" }}>
                ~{ch.minutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
