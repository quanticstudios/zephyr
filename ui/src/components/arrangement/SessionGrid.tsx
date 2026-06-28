import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Project, Track } from "@/lib/types";
import { TRACK_HEX } from "@/lib/types";
import { withAlpha } from "./constants";

const SCENES = 6;
const COL_W = "w-[120px]";
const CELL_H = "h-11";

function ClipCell({ track, name }: { track: Track; name: string }) {
  const hex = TRACK_HEX[track.color];
  return (
    <button
      type="button"
      aria-label={`Launch ${name} on ${track.name}`}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-md border px-2 text-left",
        COL_W,
        CELL_H,
      )}
      style={{ background: withAlpha(hex, 0.18), borderColor: withAlpha(hex, 0.45) }}
    >
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px]"
        style={{ background: hex, color: "#17171b" }}
      >
        <Play className="h-2.5 w-2.5" fill="currentColor" />
      </span>
      <span className="truncate text-[11px] font-medium text-ink-secondary">{name}</span>
    </button>
  );
}

function EmptyCell() {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border border-dashed border-white/10",
        COL_W,
        CELL_H,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-white/10" />
    </div>
  );
}

/**
 * The clip-launcher (session) view: scenes down the left gutter, tracks across
 * the top, and a launchable clip cell where a track has a clip for that scene.
 */
export function SessionGrid({ project }: { project: Project }) {
  const { tracks } = project;
  const scenes = Array.from({ length: SCENES }, (_, i) => i);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-panel">
      <div className="flex-1 overflow-auto p-3">
        <div className="inline-flex min-w-full flex-col gap-1.5">
          {/* column headers */}
          <div className="flex gap-1.5">
            <div className="flex h-7 w-12 shrink-0 items-center text-[9px] font-semibold uppercase tracking-wide text-ink-faint">
              Scenes
            </div>
            {tracks.map((track) => (
              <div
                key={track.id}
                className={cn("flex h-7 shrink-0 items-center gap-2 px-1", COL_W)}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ background: TRACK_HEX[track.color] }}
                />
                <span className="truncate text-[11px] font-medium text-ink-secondary">
                  {track.name}
                </span>
              </div>
            ))}
          </div>

          {/* scene rows */}
          {scenes.map((s) => (
            <div key={s} className="flex gap-1.5">
              {/* gutter: scene number + launch */}
              <div className={cn("flex w-12 shrink-0 items-center gap-1.5", CELL_H)}>
                <button
                  type="button"
                  aria-label={`Launch scene ${s + 1}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-ink-muted hover:text-ink"
                >
                  <Play className="h-2.5 w-2.5" fill="currentColor" />
                </button>
                <span className="font-mono text-[10px] text-ink-faint">{s + 1}</span>
              </div>
              {/* one cell per track */}
              {tracks.map((track) => {
                const clip = track.clips[s];
                return clip ? (
                  <ClipCell key={track.id} track={track} name={clip.name} />
                ) : (
                  <EmptyCell key={track.id} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
