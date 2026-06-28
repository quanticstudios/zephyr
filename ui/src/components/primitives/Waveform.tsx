import { useMemo } from "react";
import { cn } from "@/lib/cn";

interface WaveformProps {
  /** deterministic seed so the same clip always renders identically */
  seed: number;
  color?: string;
  /** number of sample bars */
  bars?: number;
  className?: string;
}

function makeRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Procedural audio waveform drawn as a mirrored SVG, filling its container. */
export function Waveform({ seed, color = "currentColor", bars = 96, className }: WaveformProps) {
  const heights = useMemo(() => {
    const rng = makeRng(seed);
    let env = 0.5;
    return Array.from({ length: bars }, (_, i) => {
      env += (rng() - 0.5) * 0.4;
      env = Math.max(0.12, Math.min(1, env));
      // envelope shaping so clips have a natural-looking contour
      const shape = 0.55 + 0.45 * Math.sin((i / bars) * Math.PI);
      return Math.max(0.08, env * shape * (0.6 + rng() * 0.4));
    });
  }, [seed, bars]);

  return (
    <svg
      viewBox={`0 0 ${bars} 100`}
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      style={{ color }}
    >
      {heights.map((h, i) => {
        const barHeight = h * 96;
        return (
          <rect
            key={i}
            x={i + 0.15}
            y={50 - barHeight / 2}
            width={0.7}
            height={barHeight}
            rx={0.3}
            fill={color}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}
