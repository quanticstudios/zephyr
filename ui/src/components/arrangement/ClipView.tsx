import { Waveform } from "@/components/primitives";
import { cn } from "@/lib/cn";
import type { Clip, MidiNote } from "@/lib/types";
import { TRACK_HEX } from "@/lib/types";
import { ORIGIN_BAR, PX_PER_BAR, withAlpha } from "./constants";

const HEADER_H = 14;

/** Compute the vertical placement (in %) of a midi note from its pitch. */
function noteRow(note: MidiNote, min: number, span: number): number {
  const normalized = span === 0 ? 0.5 : (note.pitch - min) / span;
  // keep notes inside the body with a little padding top/bottom
  return 12 + (1 - normalized) * 70;
}

function MidiNotes({ clip }: { clip: Extract<Clip, { type: "midi" }> }) {
  const hex = TRACK_HEX[clip.color];
  const pitches = clip.notes.map((n) => n.pitch);
  const min = pitches.length ? Math.min(...pitches) : 0;
  const max = pitches.length ? Math.max(...pitches) : 1;
  const span = max - min;
  return (
    <div className="absolute inset-0">
      {clip.notes.map((n, i) => (
        <div
          key={i}
          className="absolute rounded-[1.5px]"
          style={{
            left: `${(n.bar + n.beat / 4) * PX_PER_BAR}px`,
            width: `${Math.max(3, (n.length / 4) * PX_PER_BAR - 1)}px`,
            top: `${noteRow(n, min, span)}%`,
            height: "3px",
            background: hex,
            boxShadow: `inset 0 0 0 0.5px ${withAlpha(hex, 0.7)}`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * A single clip rendered absolutely inside its lane. Audio clips draw a
 * procedural waveform; midi clips draw a tiny note grid. Position and width
 * derive from the clip's bar geometry.
 */
export function ClipView({ clip }: { clip: Clip }) {
  const hex = TRACK_HEX[clip.color];
  const left = (clip.startBar - ORIGIN_BAR) * PX_PER_BAR + 1;
  const width = clip.lengthBars * PX_PER_BAR - 2;

  return (
    <div
      className={cn(
        "absolute overflow-hidden rounded-[3px] border border-white/10",
        clip.selected && "ring-2 ring-accent/50",
      )}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        top: "6px",
        bottom: "6px",
        background: withAlpha(hex, 0.18),
      }}
    >
      <div
        className="flex items-center truncate px-1.5 text-[9px] font-semibold tracking-[0.2px]"
        style={{ height: `${HEADER_H}px`, background: hex, color: "#17171b" }}
      >
        <span className="truncate">{clip.name}</span>
      </div>
      <div className="relative w-full" style={{ height: `calc(100% - ${HEADER_H}px)` }}>
        {clip.type === "audio" ? (
          <Waveform seed={clip.seed} color={hex} />
        ) : (
          <MidiNotes clip={clip} />
        )}
      </div>
    </div>
  );
}
