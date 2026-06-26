import type { ReactNode } from "react";

export function ComicStrip({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">{children}</div>
  );
}
