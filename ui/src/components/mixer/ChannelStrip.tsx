import type { Bus, Track, TrackColor } from "@/lib/types";
import { TRACK_HEX } from "@/lib/types";
import { Fader, Knob, Meter, SparkleBadge } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { InsertRack } from "./InsertRack";
import { SendRack } from "./SendRack";
import { dbToFader, formatDb, panLabel, panToKnob } from "./util";

interface ChannelStripProps {
  data: Track | Bus;
  color: TrackColor;
  isBus: boolean;
  /** strip width in px (driven by the console size control) */
  width: number;
  showInserts: boolean;
  showSends: boolean;
  compact?: boolean;
  /** resolved output destination name (e.g. the group bus or "Master") */
  outputName?: string;
  /** css color for the output dot */
  outputColor?: string;
}

/** A single mixer channel: cap, insert/send racks, pan, fader, meter, transport. */
export function ChannelStrip({
  data,
  color,
  isBus,
  width,
  showInserts,
  showSends,
  compact,
  outputName,
  outputColor,
}: ChannelStripProps) {
  const bus = isBus ? (data as Bus) : null;
  const track = isBus ? null : (data as Track);
  const hex = TRACK_HEX[color];

  const typeLabel = isBus ? "Group Out → Master" : (track?.kind ?? "audio");
  const muted = track?.muted ?? false;
  const soloed = track?.soloed ?? false;
  const armed = track?.recordArmed ?? false;

  return (
    <div
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-strip",
        data.aiEdited && "bg-accent/[0.04] ring-1 ring-accent/20",
      )}
      style={{ width }}
    >
      {/* cap */}
      <div
        className="flex flex-none items-center gap-1.5 px-2 py-1.5"
        style={{ background: hex }}
      >
        <span className="flex-1 truncate text-[11px] font-semibold tracking-tight text-[#17171b]">
          {data.name}
        </span>
        {isBus && (
          <span className="flex-none rounded bg-black/15 px-1.5 py-px text-[8.5px] font-bold text-[#17171b]">
            ∑ {bus?.memberCount}
          </span>
        )}
        {data.aiEdited && <SparkleBadge size={10} className="flex-none text-ai-deep" />}
      </div>

      {/* type label */}
      {!compact && (
        <div className="flex-none px-1 py-1 text-center text-[8px] font-semibold uppercase tracking-wide text-ink-muted">
          {typeLabel}
        </div>
      )}

      {/* INSERTS */}
      {showInserts && (
        <div className="mx-1.5 mt-0.5 flex h-[88px] flex-none flex-col overflow-hidden rounded-lg border border-white/5 bg-black/20">
          <div className="flex flex-none items-center px-1.5 pb-1 pt-1.5">
            <span className="flex-1 text-[8px] font-bold uppercase tracking-wide text-ink-muted">
              Inserts
            </span>
            <button
              type="button"
              aria-label="Add insert"
              className="flex h-3.5 w-3.5 items-center justify-center rounded bg-white/10 text-[11px] leading-none text-ink-secondary hover:bg-white/15"
            >
              +
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-1.5">
            <InsertRack inserts={data.inserts} />
          </div>
        </div>
      )}

      {/* SENDS */}
      {showSends && (
        <div className="mx-1.5 mt-1 flex h-[88px] flex-none flex-col overflow-hidden rounded-lg border border-white/5 bg-black/20">
          <div className="flex flex-none items-center px-1.5 pb-1 pt-1.5">
            <span className="flex-1 text-[8px] font-bold uppercase tracking-wide text-ink-muted">
              Sends
            </span>
            <button
              type="button"
              aria-label="Add send"
              className="flex h-3.5 w-3.5 items-center justify-center rounded bg-white/10 text-[11px] leading-none text-ink-secondary hover:bg-white/15"
            >
              +
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-1.5">
            <SendRack sends={data.sends} />
          </div>
        </div>
      )}

      {/* fader bay */}
      <div className="flex min-h-44 flex-1 justify-center gap-2 px-1 py-2">
        {!compact && (
          <Knob
            value={panToKnob(data.pan)}
            size={24}
            label="PAN"
            display={panLabel(data.pan)}
            className="flex-none justify-center"
          />
        )}
        <div className="h-full">
          <Fader value={dbToFader(data.volumeDb)} color={hex} />
        </div>
        <Meter levelL={data.meterL} levelR={data.meterR} scale />
      </div>

      {/* dB readout */}
      <div className="flex-none bg-black/20 py-1 text-center font-mono text-[9.5px] font-semibold text-ink-secondary">
        {formatDb(data.volumeDb)}
      </div>

      {/* M / S / R */}
      <div className="flex flex-none gap-1 px-1.5 py-1.5">
        <button
          type="button"
          aria-label="Mute"
          className={cn(
            "flex-1 rounded py-1 text-center text-[9px] font-bold",
            muted ? "bg-mute text-white" : "bg-black/30 text-ink-muted",
          )}
        >
          M
        </button>
        <button
          type="button"
          aria-label="Solo"
          className={cn(
            "flex-1 rounded py-1 text-center text-[9px] font-bold",
            soloed ? "bg-solo text-[#1a1a1c]" : "bg-black/30 text-ink-muted",
          )}
        >
          S
        </button>
        <button
          type="button"
          aria-label="Record arm"
          className={cn(
            "flex-1 rounded py-1 text-center text-[9px] font-bold",
            armed ? "bg-rec text-white" : "bg-black/30 text-ink-muted",
          )}
        >
          R
        </button>
      </div>

      {/* output chip */}
      <div className="mx-1.5 mb-2 flex h-7 flex-none items-center justify-center gap-1.5 rounded-md border border-white/5 bg-black/25 px-2">
        <span
          className="h-[7px] w-[7px] flex-none rounded-sm"
          style={{ background: outputColor ?? TRACK_HEX.master }}
        />
        <span className="truncate text-[8.5px] text-ink-secondary">
          {outputName ?? (bus?.output ?? "Master")}
        </span>
      </div>
    </div>
  );
}
