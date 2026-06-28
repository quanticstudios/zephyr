import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface FaderProps {
  /** normalized 0..1 (bottom..top) */
  value: number;
  color?: string;
  className?: string;
  onChange?: (value: number) => void;
}

/** Vertical channel fader. Fills its parent's height; drag the cap or track. */
export function Fader({ value, color = "#2b8fff", className, onChange }: FaderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState(value);
  const v = Math.max(0, Math.min(1, onChange ? internal : value));

  const set = (clientY: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nv = Math.max(0, Math.min(1, 1 - (clientY - r.top) / r.height));
    setInternal(nv);
    onChange?.(nv);
  };

  return (
    <div className={cn("relative flex h-full w-7 justify-center", className)}>
      <div
        ref={trackRef}
        className="relative h-full w-[3px] cursor-ns-resize rounded-full"
        style={{ background: "linear-gradient(to bottom, var(--color-well), var(--color-rail))" }}
        onPointerDown={(e) => {
          if (!onChange) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          set(e.clientY);
        }}
        onPointerMove={(e) => {
          if (onChange && e.buttons === 1) set(e.clientY);
        }}
      >
        <div
          className="absolute bottom-0 left-0 w-full rounded-full"
          style={{ height: `${v * 100}%`, background: `linear-gradient(to top, ${color}, var(--color-accent))` }}
        />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 h-3.5 w-7 -translate-x-1/2 rounded-[3px]"
        style={{
          bottom: `calc(${v * 100}% - 7px)`,
          background: "linear-gradient(to bottom, #3c3c42, #202024)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        <div className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-white/25" />
      </div>
    </div>
  );
}
