interface ResponseCurveProps {
  /** which response graphic to draw */
  kind: "eq" | "comp";
  /** stroke color (device-kind hex) */
  color: string;
}

/** Tiny response-curve readout drawn above a device's knob grid.
   "eq" -> a smooth bell (dip then boost) over a midline.
   "comp" -> a unity line that bends to a shallower slope above the knee.
   Geometry is static SVG; only the stroke color is data-driven. */
export function ResponseCurve({ kind, color }: ResponseCurveProps) {
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="block h-10 w-full rounded border border-white/5 bg-well"
    >
      {kind === "eq" ? (
        <>
          <line
            x1={0}
            y1={20}
            x2={100}
            y2={20}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 0 20 C 16 20 22 31 34 31 C 46 31 52 9 66 9 C 80 9 88 20 100 20"
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : (
        <>
          <line
            x1={5}
            y1={37}
            x2={95}
            y2={5}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 6 36 L 42 15 L 96 8"
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}
