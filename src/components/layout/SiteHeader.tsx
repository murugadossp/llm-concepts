import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header
      className="relative sticky top-0 z-50 mx-auto mt-4 flex w-[min(100%-2rem,1500px)] items-center justify-between gap-4 rounded-[22px] border px-5 py-3 shadow-sm"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <Link
        href="/"
        className="font-display text-lg font-semibold tracking-tight"
        style={{ color: "var(--ink)" }}
      >
        LLM → Agent
      </Link>
      <nav className="flex items-center gap-4 text-sm" style={{ color: "var(--ink-soft)" }}>
        <Link href="/chapters" className="hover:underline">
          Chapters
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/pricing" className="hover:underline">
          Pricing
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
