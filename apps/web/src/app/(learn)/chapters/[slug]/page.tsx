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
import type React from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], rehypeKatex],
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
      <article className="min-w-0 flex-1 pb-8">
        <ChapterNav chapter={chapter} prev={prev} next={next} />
        <header className="mb-12 pt-5">
          <span className="eyebrow-pill">
            <span className="eyebrow-dot" />
            {chapterLabel} · {chapter.difficulty}
          </span>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h1
                className="editorial-title mt-5 text-[clamp(2.8rem,6vw,4.75rem)]"
                style={{ color: "var(--ink)" }}
              >
                {chapter.title}
              </h1>
              <p
                className="mt-4 max-w-[68ch] text-lg leading-8"
                style={{ color: "var(--ink-soft)" }}
              >
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
                Tess,
                Vector,
                Atlas,
                MCPMae,
              };
              const primary = chapter.characters[0];
              const Char = primary ? characterMap[primary] : undefined;
              return Char ? (
                <div
                  className="glass hidden h-28 w-28 shrink-0 place-items-center p-4 md:grid"
                  style={{ color: "var(--accent)" }}
                >
                  <Char className="h-20 w-20" />
                </div>
              ) : null;
            })()}
          </div>
        </header>
        <div className="chapter-prose max-w-[var(--maxw-content)]">{content}</div>
      </article>
    </div>
  );
}
