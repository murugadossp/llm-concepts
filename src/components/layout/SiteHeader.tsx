import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="glass-strong sticky top-0 z-50 mx-auto mt-4 flex w-[min(100%-2rem,var(--maxw-wide))] items-center justify-between gap-4 px-5 py-3">
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
