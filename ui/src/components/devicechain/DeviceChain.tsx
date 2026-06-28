import { Plus, X, Zap } from "lucide-react";
import { TRACK_HEX, type Track } from "@/lib/types";
import { LED } from "@/components/primitives";
import { DeviceCard } from "./DeviceCard";

interface DeviceChainProps {
  track: Track;
  onClose?: () => void;
}

/** A horizontal signal-flow drawer for a single track's plugin chain:
   IN -> device cards -> drop target -> OUT. */
export function DeviceChain({ track, onClose }: DeviceChainProps) {
  const trackHex = TRACK_HEX[track.color];

  return (
    <div className="flex h-full w-full flex-col bg-rail">
      {/* header */}
      <div className="flex h-[34px] shrink-0 items-center gap-2 border-b border-border bg-rail px-3">
        <span
          className="h-[10px] w-[10px] shrink-0 rounded-[3px]"
          style={{ background: trackHex }}
        />
        <span className="text-xs font-semibold tracking-[-0.2px] text-ink">
          {track.name}
        </span>
        <span className="text-[8px] font-semibold uppercase tracking-wide text-ink-muted">
          Device Chain
        </span>
        <span className="text-[10px] text-ink-muted">
          {track.devices.length} devices
        </span>

        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-ink-muted">
          <LED color="var(--color-success)" size={6} />
          Signal flow →
        </span>

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="grid h-6 w-6 place-items-center rounded-md bg-white/5 text-ink-secondary transition-colors hover:bg-white/10 hover:text-ink"
        >
          <X size={14} />
        </button>
      </div>

      {/* devices */}
      <div className="flex flex-1 items-center gap-2 overflow-x-auto p-3">
        {/* input chip */}
        <div className="flex shrink-0 flex-col items-center gap-1.5 text-ink-dim">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-lg border border-white/10 bg-well">
            <Zap size={14} />
          </span>
          <span className="text-[8px] tracking-wide">IN</span>
        </div>

        {track.devices.map((device) => (
          <div key={device.id} className="flex shrink-0 items-center gap-2">
            <span className="shrink-0 text-[13px] text-ink-faint">→</span>
            <DeviceCard device={device} />
          </div>
        ))}

        {/* drop target */}
        <span className="shrink-0 text-[13px] text-ink-faint">→</span>
        <button
          type="button"
          className="grid w-[160px] shrink-0 cursor-pointer place-items-center self-stretch rounded-lg border border-dashed border-white/15 text-ink-muted transition-colors hover:border-white/25 hover:text-ink-secondary"
        >
          <span className="flex flex-col items-center gap-1.5">
            <Plus size={18} />
            <span className="text-[10px] font-medium">Drop a device</span>
          </span>
        </button>

        {/* output chip */}
        <div className="flex shrink-0 flex-col items-center gap-1.5 text-ink-dim">
          <span
            className="h-[30px] w-[30px] rounded-lg border"
            style={{ background: `${trackHex}29`, borderColor: `${trackHex}80` }}
          />
          <span className="text-[8px] tracking-wide">OUT</span>
        </div>
      </div>
    </div>
  );
}
