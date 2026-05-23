import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { Tess } from "@/characters/Tess";
import { Chip } from "@/components/learn/Chip";
import { ChapterNav } from "@/components/layout/ChapterNav";
import { ChapterSidebar } from "@/components/layout/ChapterSidebar";
import { getAdjacentChapters, getAllChapters, getChapter } from "@/lib/chapters";
import { mdxComponents } from "@/lib/mdx-components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllChapters().map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "Chapter not found" };

  return {
    title: `${chapter.title} | LLM → Agent`,
    description: chapter.summary,
    openGraph: {
      title: chapter.title,
      description: chapter.summary,
      type: "article",
      images: [`/api/og/${chapter.slug}`],
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const { content } = await compileMDX({
    source: chapter.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  const { prev, next } = getAdjacentChapters(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapter.title,
    description: chapter.summary,
    dateModified: chapter.updatedAt,
    author: chapter.authors.map((name) => ({ "@type": "Person", name })),
    url: `${baseUrl}/chapters/${chapter.slug}`,
  };

  return (
    <div className="mx-auto flex w-[min(100%-2rem,var(--maxw-wide))] gap-8 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChapterSidebar activeSlug={slug} />
      <article className="min-w-0 flex-1">
        <ChapterNav chapter={chapter} prev={prev} next={next} />
        <header className="glass-strong mb-8 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--accent-2)" }}>
                Chapter {chapter.chapterNumber}
              </p>
              <h1 className="font-display mt-2 text-4xl font-bold" style={{ color: "var(--ink)" }}>
                {chapter.title}
              </h1>
              <p className="mt-3 text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {chapter.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip tone="accent">{chapter.tier}</Chip>
                <Chip tone="neutral">{chapter.difficulty}</Chip>
                <Chip tone="neutral">~{chapter.estimatedMinutes} min</Chip>
              </div>
            </div>
            {chapter.characters.includes("Tess") ? (
              <Tess className="h-20 w-20 shrink-0" />
            ) : null}
          </div>
        </header>
        <div className="chapter-prose max-w-[var(--maxw-content)]">{content}</div>
      </article>
    </div>
  );
}
