import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PillProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

/** Tiny rounded chip used for status labels (Saved, route labels, badges). */
export function Pill({ children, active, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium leading-none",
        active
          ? "bg-accent/15 text-accent"
          : "bg-white/5 text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
