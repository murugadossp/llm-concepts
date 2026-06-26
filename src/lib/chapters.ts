import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const chaptersDir = path.join(process.cwd(), "src/content/chapters");

const chapterMetaSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  navTitle: z.string().min(1).optional(),
  chapterNumber: z.number().int().positive(),
  lessonNumber: z.number().int().nonnegative().optional(),
  parentSlug: z.string().min(1).optional(),
  section: z.enum(["foundations", "core", "modern-stack", "safety"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedMinutes: z.number().int().positive(),
  tier: z.enum(["free", "pro"]),
  prereqs: z.array(z.string()).default([]),
  characters: z.array(z.string()).default([]),
  ogImageVariant: z.string().min(1),
  suggestedPrompts: z.array(z.string()).optional(),
  updatedAt: z.string().min(1),
  authors: z.array(z.string()).min(1),
  summary: z.string().min(1),
});

export type ChapterMeta = z.infer<typeof chapterMetaSchema>;

export type Chapter = ChapterMeta & {
  content: string;
  filePath: string;
};

export type ChapterTreeItem = ChapterMeta & {
  lessons: ChapterMeta[];
};

function readChapterFile(filename: string): Chapter {
  const filePath = path.join(chaptersDir, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = chapterMetaSchema.parse(data);
  return { ...meta, content: content.trim(), filePath };
}

export function getAllChapters(): ChapterMeta[] {
  if (!fs.existsSync(chaptersDir)) return [];

  return fs
    .readdirSync(chaptersDir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => readChapterFile(name))
    .sort(compareChapters)
    .map(({ content: _content, filePath: _filePath, ...meta }) => meta);
}

function compareChapters(a: ChapterMeta, b: ChapterMeta): number {
  if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
  return (a.lessonNumber ?? 0) - (b.lessonNumber ?? 0);
}

export function getChapterTree(): ChapterTreeItem[] {
  const chapters = getAllChapters();
  const roots = chapters.filter((chapter) => !chapter.parentSlug);

  return roots.map((root) => ({
    ...root,
    lessons: chapters.filter((chapter) => chapter.parentSlug === root.slug),
  }));
}

export function getChapter(slug: string): Chapter | null {
  if (!fs.existsSync(chaptersDir)) return null;

  const match = fs
    .readdirSync(chaptersDir)
    .find(
      (name) => name.endsWith(".mdx") && (name === `${slug}.mdx` || name.endsWith(`-${slug}.mdx`)),
    );

  if (!match) {
    const byMeta = fs
      .readdirSync(chaptersDir)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => readChapterFile(name))
      .find((chapter) => chapter.slug === slug);
    return byMeta ?? null;
  }

  return readChapterFile(match);
}

export function getAdjacentChapters(slug: string): {
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
} {
  const chapters = getAllChapters();
  const index = chapters.findIndex((chapter) => chapter.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: chapters[index - 1] ?? null,
    next: chapters[index + 1] ?? null,
  };
}
