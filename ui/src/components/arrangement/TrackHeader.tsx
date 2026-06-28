import { useState } from "react";
import { MeterBar } from "@/components/primitives";
import { cn } from "@/lib/cn";
import type { Track } from "@/lib/types";
import { TRACK_HEX } from "@/lib/types";
import { withAlpha } from "./constants";

interface TrackHeaderProps {
  track: Track;
  onOpenDevices?: (trackId: string) => void;
}

/**
 * The fixed-width left header for one track lane: color bar, badge, name,
 * mute/solo toggles and a level meter. Double-click opens the device chain.
 */
export function TrackHeader({ track, onOpenDevices }: TrackHeaderProps) {
  const hex = TRACK_HEX[track.color];
  const [muted, setMuted] = useState(!!track.muted);
  const [soloed, setSoloed] = useState(!!track.soloed);

  return (
    <div
      onDoubleClick={() => onOpenDevices?.(track.id)}
      className="flex h-[58px] w-[150px] cursor-pointer items-center gap-2 border-b border-r border-white/5 bg-[#1a1a1c] px-2"
    >
      <div className="h-full w-1 shrink-0 rounded-full" style={{ background: hex }} />
      <span
        className="flex h-4 shrink-0 items-center justify-center rounded-[4px] px-1 text-[9px] font-bold"
        style={{ background: withAlpha(hex, 0.9), color: "#17171b" }}
      >
        {track.short}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink-secondary">
        {track.name}
      </span>
      <button
        type="button"
        aria-label={`Mute ${track.name}`}
        aria-pressed={muted}
        onClick={(e) => {
          e.stopPropagation();
          setMuted((v) => !v);
        }}
        className={cn(
          "flex h-[15px] w-[17px] shrink-0 items-center justify-center rounded-[4px] text-[9px] font-semibold",
          muted ? "bg-mute text-white" : "bg-white/5 text-ink-muted",
        )}
      >
        M
      </button>
      <button
        type="button"
        aria-label={`Solo ${track.name}`}
        aria-pressed={soloed}
        onClick={(e) => {
          e.stopPropagation();
          setSoloed((v) => !v);
        }}
        className={cn(
          "flex h-[15px] w-[17px] shrink-0 items-center justify-center rounded-[4px] text-[9px] font-semibold",
          soloed ? "bg-solo text-black" : "bg-white/5 text-ink-muted",
        )}
      >
        S
      </button>
      <MeterBar level={track.meterL} className="h-6 w-[5px] shrink-0" />
    </div>
  );
}
