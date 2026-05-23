import type React from "react";
import { Atlas } from "@/characters/Atlas";
import { MCPMae } from "@/characters/MCPMae";
import { Tess } from "@/characters/Tess";
import { Vector } from "@/characters/Vector";
import { ChapterNav } from "@/components/layout/ChapterNav";
import { ChapterSidebar } from "@/components/layout/ChapterSidebar";
import { Chip } from "@/components/learn/Chip";
import { getAdjacentChapters, getAllChapters, getChapter } from "@/lib/chapters";
import { mdxComponents } from "@/lib/mdx-components";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

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
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
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
  const jsonLdPayload = JSON.stringify(jsonLd).replaceAll("<", "\\u003c");

  const chapterLabel =
    chapter.lessonNumber && chapter.lessonNumber > 0
      ? `Chapter ${chapter.chapterNumber}.${chapter.lessonNumber}`
      : `Chapter ${chapter.chapterNumber}`;

  return (
    <div className="flex w-full gap-6 px-3 py-8 lg:px-6 xl:px-8">
      <script
        type="application/ld+json"
        // JSON-LD has to be emitted as script content for search engines.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Payload is server-created metadata and escapes "<" before insertion.
        dangerouslySetInnerHTML={{ __html: jsonLdPayload }}
      />
      <ChapterSidebar activeSlug={slug} />
      <article className="min-w-0 flex-1">
        <ChapterNav chapter={chapter} prev={prev} next={next} />
        <header className="glass-strong mb-8 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--accent-2)" }}>
                {chapterLabel}
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
            {(() => {
              const characterMap: Record<string, React.ComponentType<{ className?: string }>> = {
                Tess, Vector, Atlas, MCPMae,
              };
              const primary = chapter.characters[0];
              const Char = primary ? characterMap[primary] : undefined;
              return Char ? <Char className="h-20 w-20 shrink-0" /> : null;
            })()}
          </div>
        </header>
        <div className="chapter-prose max-w-[var(--maxw-content)]">{content}</div>
      </article>
    </div>
  );
}
