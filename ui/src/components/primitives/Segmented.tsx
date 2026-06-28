import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedOption<T extends string> {
  key: T;
  label: ReactNode;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (key: T) => void;
  size?: "sm" | "md";
  className?: string;
}

/** Compact segmented control (Arrange/Mix/Split/Session, Inserts/Sends, Width S/M/L).
   Custom element -> uses native onClick (HeroUI components use onPress). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg bg-well p-0.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              "rounded-md font-medium transition-colors",
              size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
              active
                ? "bg-elevated text-ink shadow-sm"
                : "text-ink-muted hover:text-ink-secondary",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
