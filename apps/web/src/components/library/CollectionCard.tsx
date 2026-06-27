import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function CollectionCard({
  href,
  eyebrow,
  title,
  description,
  meta,
  icon,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: string[];
  icon: ReactNode;
}) {
  return (
    <Link href={href} className="lesson-card group block h-full p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--r-md)]"
          style={{
            background: "color-mix(in srgb, var(--accent) 13%, transparent)",
            color: "var(--accent)",
          }}
        >
          {icon}
        </span>
        <span className="lesson-chip">{eyebrow}</span>
      </div>
      <h2 className="editorial-title mt-6 text-4xl" style={{ color: "var(--ink)" }}>
        {title}
      </h2>
      <p className="mt-3 max-w-[58ch] text-sm leading-7" style={{ color: "var(--ink-soft)" }}>
        {description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {meta.map((item) => (
          <span key={item} className="lesson-chip">
            {item}
          </span>
        ))}
      </div>
      <span
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: "var(--accent)" }}
      >
        Explore learning path
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
