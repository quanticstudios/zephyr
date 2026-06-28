import { cn } from "@/lib/cn";

const METER_GRADIENT =
  "linear-gradient(to top, #2fa05f 0%, #54c98a 48%, #e8c24e 74%, #ff5a4d 100%)";

interface MeterBarProps {
  /** normalized 0..1 */
  level: number;
  /** normalized 0..1 peak-hold marker */
  peak?: number;
  className?: string;
}

/** A single vertical level bar with a peak-hold line. */
export function MeterBar({ level, peak, className }: MeterBarProps) {
  const v = Math.max(0, Math.min(1, level));
  return (
    <div className={cn("relative h-full w-[5px] overflow-hidden rounded-[1px] bg-well", className)}>
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: `${v * 100}%`, background: METER_GRADIENT }}
      />
      {peak !== undefined && (
        <div
          className="absolute left-0 h-[1.5px] w-full bg-white/80"
          style={{ bottom: `${Math.max(0, Math.min(1, peak)) * 100}%` }}
        />
      )}
    </div>
  );
}

interface MeterProps {
  levelL: number;
  levelR: number;
  peakL?: number;
  peakR?: number;
  /** render the dB scale column to the left */
  scale?: boolean;
  className?: string;
}

const SCALE = ["+6", "0", "-6", "-12", "-24", "-∞"];

/** Dual L/R meter with optional dB scale, as used on channel + master strips. */
export function Meter({ levelL, levelR, peakL, peakR, scale, className }: MeterProps) {
  return (
    <div className={cn("flex h-full items-stretch gap-[3px]", className)}>
      {scale && (
        <div className="flex h-full flex-col justify-between pr-0.5 text-right">
          {SCALE.map((s) => (
            <span key={s} className="font-mono text-[6.5px] leading-none text-ink-faint">
              {s}
            </span>
          ))}
        </div>
      )}
      <MeterBar level={levelL} peak={peakL ?? levelL} />
      <MeterBar level={levelR} peak={peakR ?? levelR} />
    </div>
  );
}
