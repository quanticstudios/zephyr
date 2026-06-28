import { cn } from "@/lib/cn";

interface LEDProps {
  on?: boolean;
  /** css color when on; defaults to success green */
  color?: string;
  size?: number;
  className?: string;
}

/** Small status dot used on insert slots and device headers. */
export function LED({ on = true, color = "var(--color-success)", size = 6, className }: LEDProps) {
  return (
    <span
      className={cn("inline-block rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: on ? color : "#5a5a5f",
        boxShadow: on ? `0 0 5px ${color}` : "none",
      }}
    />
  );
}
