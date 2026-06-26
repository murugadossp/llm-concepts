import { ChapterSidebarShell } from "@/components/layout/ChapterSidebarShell";
import { getChapterTree } from "@/lib/chapters";

export function ChapterSidebar({ activeSlug }: { activeSlug: string }) {
  return <ChapterSidebarShell activeSlug={activeSlug} chapterTree={getChapterTree()} />;
}
