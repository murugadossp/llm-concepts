import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Network } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <Link href="/" className="flex items-center gap-2.5 border-0" style={{ color: "var(--ink)" }}>
        <span
          className="grid h-8 w-8 place-items-center rounded-[10px]"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            boxShadow: "0 4px 14px var(--ring)",
            color: "#fff",
          }}
        >
          <Network className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold">LLM → Agent</span>
          <span className="mt-1 text-[11px] font-medium" style={{ color: "var(--ink-mute)" }}>
            Concepts &amp; examples
          </span>
        </span>
      </Link>
      <nav className="flex items-center gap-1 text-[13px]" style={{ color: "var(--ink-soft)" }}>
        <Link
          href="/chapters"
          className="hidden rounded-lg px-2.5 py-1.5 hover:bg-[var(--surface-hover)] sm:block"
        >
          Learning Paths
        </Link>
        <Link
          href="/about"
          className="hidden rounded-lg px-2.5 py-1.5 hover:bg-[var(--surface-hover)] md:block"
        >
          About
        </Link>
        <Link
          href="/pricing"
          className="hidden rounded-lg px-2.5 py-1.5 hover:bg-[var(--surface-hover)] md:block"
        >
          Pricing
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
