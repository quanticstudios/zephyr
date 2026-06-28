import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

interface SparkleBadgeProps {
  size?: number;
  className?: string;
  /** add a soft blue glow (used on AI-edited elements) */
  glow?: boolean;
}

/** The ✦ marker the design uses to flag AI-touched settings. */
export function SparkleBadge({ size = 11, className, glow }: SparkleBadgeProps) {
  return (
    <Sparkles
      size={size}
      strokeWidth={2}
      className={cn("text-accent", className)}
      style={glow ? { filter: "drop-shadow(0 0 4px rgba(41,151,255,0.6))" } : undefined}
    />
  );
}
