import type { ReactNode } from "react";

export function ProOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  // Milestone 1: all content is free; gating activates in Milestone 2.
  void fallback;
  return <>{children}</>;
}
