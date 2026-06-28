import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { SparkleBadge } from "./SparkleBadge";

interface KnobProps {
  /** normalized 0..1 */
  value: number;
  label?: string;
  display?: string;
  size?: number;
  /** css color for the filled arc; defaults to accent */
  color?: string;
  aiEdited?: boolean;
  className?: string;
  onChange?: (value: number) => void;
}

/** Rotary knob: 270deg conic-gradient arc (start 225deg) + domed cap + pointer.
   Drag vertically to change. Geometry is computed inline; styling is Tailwind. */
export function Knob({
  value,
  label,
  display,
  size = 28,
  color = "var(--color-accent)",
  aiEdited,
  className,
  onChange,
}: KnobProps) {
  const [internal, setInternal] = useState(value);
  const v = Math.max(0, Math.min(1, onChange ? internal : value));
  const sweep = v * 270;
  const pointer = -135 + v * 270;
  const drag = useRef<{ y: number; v: number } | null>(null);

  const ring = `conic-gradient(from 225deg, ${color} 0deg, ${color} ${sweep}deg, rgba(255,255,255,0.09) ${sweep}deg, rgba(255,255,255,0.09) 270deg, transparent 270deg)`;
  const mask = "radial-gradient(circle, transparent 54%, #000 55%)";

  return (
    <div className={cn("flex select-none flex-col items-center gap-1", className)}>
      <div
        className="relative cursor-ns-resize"
        style={{ width: size, height: size }}
        onPointerDown={(e) => {
          if (!onChange) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, v };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !onChange) return;
          const dy = drag.current.y - e.clientY;
          const nv = Math.max(0, Math.min(1, drag.current.v + dy / 120));
          setInternal(nv);
          onChange(nv);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: ring, WebkitMaskImage: mask, maskImage: mask }}
        />
        <div
          className="absolute rounded-full"
          style={{
            inset: "20%",
            background: "radial-gradient(circle at 50% 32%, #34343a, #1c1c1f)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ transform: `rotate(${pointer}deg)` }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{ top: size * 0.14, width: 2, height: size * 0.2, background: color }}
          />
        </div>
        {aiEdited && (
          <SparkleBadge size={9} className="absolute -right-1 -top-1" glow />
        )}
      </div>
      {label && (
        <span className="text-[8px] font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </span>
      )}
      {display && (
        <span className="font-mono text-[8.5px] leading-none text-ink-secondary">
          {display}
        </span>
      )}
    </div>
  );
}
