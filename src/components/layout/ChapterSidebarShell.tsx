"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { ChapterTreeItem } from "@/lib/chapters";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Home,
  Library,
  Menu,
  Route,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ChapterSidebarShellProps = {
  activeSlug: string;
  chapterTree: ChapterTreeItem[];
};

const primaryNav = [
  { label: "Continue", href: "/chapters/01-foundations", icon: Sparkles },
  { label: "Chapters", href: "/chapters", icon: Library },
  { label: "Dashboard", href: "/dashboard", icon: Home },
];

export function ChapterSidebarShell({ activeSlug, chapterTree }: ChapterSidebarShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("llm-agent-sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("llm-agent-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const activeParentSlug = useMemo(() => {
    for (const chapter of chapterTree) {
      if (
        chapter.slug === activeSlug ||
        chapter.lessons.some((lesson) => lesson.slug === activeSlug)
      ) {
        return chapter.slug;
      }
    }
    return activeSlug;
  }, [activeSlug, chapterTree]);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="glass fixed bottom-5 left-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-[var(--r-sm)] lg:hidden"
        aria-label="Open learning menu"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/35 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close learning menu"
        />
      ) : null}

      <div
        className={[
          "fixed inset-y-0 left-0 z-50 p-3 transition-transform duration-200 lg:sticky lg:top-24 lg:z-30 lg:h-[calc(100vh-7rem)] lg:translate-x-0 lg:p-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarContent
          activeParentSlug={activeParentSlug}
          activeSlug={activeSlug}
          chapterTree={chapterTree}
          collapsed={collapsed}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
      </div>
    </>
  );
}

function SidebarContent({
  activeParentSlug,
  activeSlug,
  chapterTree,
  collapsed,
  onCloseMobile,
  onToggleCollapsed,
}: {
  activeParentSlug: string;
  activeSlug: string;
  chapterTree: ChapterTreeItem[];
  collapsed: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}) {
  return (
    <aside
      className={[
        "glass-strong flex h-full flex-col overflow-hidden transition-[width] duration-200",
        collapsed ? "w-[84px]" : "w-[292px]",
      ].join(" ")}
      aria-label="Learning path"
    >
      <div className="flex items-center gap-3 px-4 py-5">
        <Link
          href="/chapters"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px]"
          style={{ background: "var(--accent)", color: "white" }}
          aria-label="LLM to Agent chapters"
          title="LLM to Agent"
        >
          <Route className="h-5 w-5" aria-hidden />
        </Link>
        {collapsed ? null : (
          <div className="min-w-0">
            <Link
              href="/chapters"
              className="block truncate text-sm font-semibold"
              style={{ color: "var(--ink)" }}
            >
              LLM to Agent
            </Link>
            <p className="truncate text-xs" style={{ color: "var(--ink-mute)" }}>
              From tokens to agents
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onCloseMobile}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-[12px] transition hover:opacity-80 lg:hidden"
          style={{ color: "var(--ink-soft)", background: "var(--surface)" }}
          aria-label="Close learning menu"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <nav className="space-y-1 px-3" aria-label="Primary">
        {primaryNav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex h-11 items-center gap-3 rounded-[16px] px-3 text-sm font-medium transition hover:opacity-80"
            style={{ color: "var(--ink-soft)" }}
            title={collapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            {collapsed ? null : <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {collapsed ? (
          <div className="space-y-2" aria-label="Chapter shortcuts">
            {chapterTree.map((chapter) => {
              const active = chapter.slug === activeParentSlug;
              return (
                <Link
                  key={chapter.slug}
                  href={`/chapters/${chapter.lessons[0]?.slug ?? chapter.slug}`}
                  className="flex h-11 items-center justify-center rounded-[16px] text-sm font-semibold transition hover:opacity-85"
                  style={{
                    background: active ? "var(--accent)" : "var(--surface-strong)",
                    color: active ? "white" : "var(--ink-soft)",
                  }}
                  title={chapter.navTitle ?? chapter.title}
                >
                  {chapter.chapterNumber}
                </Link>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="mb-2 flex items-center justify-between px-2">
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--ink-mute)" }}
              >
                Learning Path
              </p>
              <BookOpen className="h-4 w-4" style={{ color: "var(--ink-mute)" }} aria-hidden />
            </div>
            <ol className="space-y-3">
              {chapterTree.map((chapter) => (
                <li key={chapter.slug}>
                  <ChapterGroup
                    activeParentSlug={activeParentSlug}
                    activeSlug={activeSlug}
                    chapter={chapter}
                  />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="border-t p-3" style={{ borderColor: "var(--border-strong)" }}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] transition hover:opacity-80"
              style={{ background: "var(--surface-strong)", color: "var(--ink-soft)" }}
              aria-label="Expand sidebar"
              title="Expand"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <Link
              href="/about"
              className="flex h-10 w-10 items-center justify-center rounded-[14px] transition hover:opacity-80"
              style={{ background: "var(--surface-strong)", color: "var(--ink-soft)" }}
              aria-label="Help"
              title="Help"
            >
              <CircleHelp className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-[18px] p-3" style={{ background: "var(--surface)" }}>
              <p className="text-xs font-medium" style={{ color: "var(--ink-mute)" }}>
                Current module
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: "var(--ink)" }}>
                Chapter 1 foundations
              </p>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full"
                style={{ background: "var(--surface-strong)" }}
              >
                <div
                  className="h-full w-1/5 rounded-full"
                  style={{ background: "var(--accent-2)" }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] transition hover:opacity-80"
                style={{ background: "var(--surface-strong)", color: "var(--ink-soft)" }}
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function ChapterGroup({
  activeParentSlug,
  activeSlug,
  chapter,
}: {
  activeParentSlug: string;
  activeSlug: string;
  chapter: ChapterTreeItem;
}) {
  const active = chapter.slug === activeParentSlug;
  const href = `/chapters/${chapter.lessons[0]?.slug ?? chapter.slug}`;

  return (
    <div
      className="rounded-[18px] p-1.5"
      style={{ background: active ? "var(--surface)" : "transparent" }}
    >
      <Link
        href={href}
        className="flex items-center gap-3 rounded-[14px] px-2.5 py-2 text-sm font-semibold transition hover:opacity-80"
        style={{ color: active ? "var(--ink)" : "var(--ink-soft)" }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] text-xs font-bold"
          style={{
            background: active ? "var(--accent)" : "var(--surface-strong)",
            color: active ? "white" : "var(--ink-soft)",
          }}
        >
          {chapter.chapterNumber}
        </span>
        <span className="min-w-0 truncate">{chapter.navTitle ?? chapter.title}</span>
      </Link>
      {chapter.lessons.length > 0 && active ? (
        <ol className="mt-1 space-y-1 pl-11">
          {chapter.lessons.map((lesson) => {
            const lessonActive = lesson.slug === activeSlug;
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/chapters/${lesson.slug}`}
                  className="block rounded-[12px] px-3 py-2 text-sm transition hover:opacity-80"
                  style={{
                    background: lessonActive ? "var(--accent)" : "transparent",
                    color: lessonActive ? "white" : "var(--ink-soft)",
                    fontWeight: lessonActive ? 700 : 500,
                  }}
                >
                  <span className="mr-2 text-xs opacity-70">
                    {chapter.chapterNumber}.{lesson.lessonNumber}
                  </span>
                  {lesson.navTitle ?? lesson.title}
                </Link>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
