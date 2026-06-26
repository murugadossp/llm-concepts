import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
};

export function Button({ variant = "default", className = "", ...props }: ButtonProps) {
  const styles =
    variant === "ghost"
      ? { background: "transparent", color: "var(--ink-soft)" }
      : { background: "var(--accent)", color: "#fff" };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-[var(--r-pill)] px-4 py-2 text-sm font-semibold transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${className}`}
      style={styles}
      {...props}
    />
  );
}
