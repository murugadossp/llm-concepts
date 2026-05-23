import Link from "next/link";
import { Chip } from "@/components/learn/Chip";
import { getAllChapters } from "@/lib/chapters";

export default function ChaptersHubPage() {
  const chapters = getAllChapters();

  return (
    <div className="mx-auto w-[min(100%-2rem,var(--maxw-wide))] px-4 py-10">
      <h1 className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
        Chapters
      </h1>
      <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
        Flagship lessons ship first. More chapters follow the BLUEPRINT build order.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              href={`/chapters/${chapter.slug}`}
              className="glass block h-full p-6 transition hover:opacity-95"
            >
              <div className="flex flex-wrap gap-2">
                <Chip tone="accent">{chapter.tier}</Chip>
                <Chip tone="neutral">{chapter.difficulty}</Chip>
              </div>
              <h2 className="font-display mt-3 text-xl font-semibold" style={{ color: "var(--ink)" }}>
                {chapter.title}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                {chapter.summary}
              </p>
              <p className="mt-4 text-xs" style={{ color: "var(--ink-mute)" }}>
                ~{chapter.estimatedMinutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
