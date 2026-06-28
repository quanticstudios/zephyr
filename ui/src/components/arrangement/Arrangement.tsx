import { useRef } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/types";
import { ClipView } from "./ClipView";
import { LANE_H, PX_PER_BAR } from "./constants";
import { TrackHeader } from "./TrackHeader";

interface ArrangementProps {
  project: Project;
  onOpenDevices?: (trackId: string) => void;
}

const PLAYHEAD_BAR = 17.1;
const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * The center arrangement: a frozen left track-header column aligned with a
 * scrollable timeline (section markers, bar ruler and per-track clip lanes).
 */
export function Arrangement({ project, onOpenDevices }: ArrangementProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const lanesRef = useRef<HTMLDivElement>(null);

  const { startBar, totalBars, sections, tracks } = project;
  const contentW = totalBars * PX_PER_BAR;
  const lanesH = tracks.length * LANE_H;

  // keep the section/ruler row and the header column locked to the lanes scroll
  const syncScroll = () => {
    const lanes = lanesRef.current;
    if (!lanes) return;
    if (topRef.current) topRef.current.scrollLeft = lanes.scrollLeft;
    if (leftRef.current) leftRef.current.scrollTop = lanes.scrollTop;
  };

  const chorus = sections.find((s) => s.highlight);

  const bars = Array.from({ length: totalBars + 1 }, (_, i) => i);
  const playheadX = (PLAYHEAD_BAR - startBar) * PX_PER_BAR;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-panel">
      {/* ----- section markers + ruler (frozen vertically) ----- */}
      <div className="flex flex-none">
        {/* top-left corner cells */}
        <div className="w-[150px] flex-none border-r border-white/5">
          <div className="h-6 border-b border-white/5" />
          <div className="flex h-6 items-center border-b border-white/10 bg-rail px-2.5 text-[8px] font-semibold uppercase tracking-wide text-ink-muted">
            Bars
          </div>
        </div>
        {/* scrollable section + ruler */}
        <div ref={topRef} className={cn("relative flex-1 overflow-hidden", HIDE_SCROLLBAR)}>
          <div style={{ width: `${contentW}px` }}>
            {/* section markers */}
            <div className="relative h-6 border-b border-white/5">
              {sections.map((sec) => {
                const left = (sec.startBar - startBar) * PX_PER_BAR;
                const width = sec.lengthBars * PX_PER_BAR;
                return (
                  <div
                    key={sec.id}
                    className={cn(
                      "absolute top-1 flex h-4 items-center justify-center rounded-[5px] text-[10px] font-semibold uppercase tracking-wide",
                      sec.highlight
                        ? "bg-accent/15 text-accent"
                        : "bg-white/5 text-ink-muted",
                    )}
                    style={{ left: `${left + 3}px`, width: `${width - 6}px` }}
                  >
                    {sec.name}
                  </div>
                );
              })}
            </div>
            {/* ruler */}
            <div className="relative h-6 border-b border-white/10 bg-rail">
              {bars.slice(0, totalBars).map((b) => (
                <span
                  key={b}
                  className="absolute top-1.5 font-mono text-[10px] text-ink-faint"
                  style={{ left: `${b * PX_PER_BAR + 6}px` }}
                >
                  {startBar + b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ----- track headers + clip lanes (shared vertical scroll) ----- */}
      <div className="flex min-h-0 flex-1">
        {/* frozen header column */}
        <div
          ref={leftRef}
          className={cn(
            "w-[150px] flex-none overflow-hidden border-r border-white/5",
            HIDE_SCROLLBAR,
          )}
        >
          {tracks.map((track) => (
            <TrackHeader key={track.id} track={track} onOpenDevices={onOpenDevices} />
          ))}
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            className="h-10 justify-start gap-2 rounded-none px-3 text-[11px] text-ink-muted"
            onPress={() => {}}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Track
          </Button>
        </div>

        {/* scrollable lanes */}
        <div
          ref={lanesRef}
          onScroll={syncScroll}
          className={cn("relative flex-1 overflow-auto", HIDE_SCROLLBAR)}
        >
          <div className="relative" style={{ width: `${contentW}px`, height: `${lanesH}px` }}>
            {/* chorus highlight overlay */}
            {chorus && (
              <div
                className="pointer-events-none absolute inset-y-0 z-0 border-l border-accent/25 bg-accent/[0.04]"
                style={{
                  left: `${(chorus.startBar - startBar) * PX_PER_BAR}px`,
                  width: `${chorus.lengthBars * PX_PER_BAR}px`,
                }}
              />
            )}

            {/* bar + beat gridlines */}
            {bars.map((b) => (
              <div
                key={`bar-${b}`}
                className="absolute inset-y-0 z-0 border-l border-white/5"
                style={{ left: `${b * PX_PER_BAR}px` }}
              />
            ))}
            {bars.slice(0, totalBars).map((b) =>
              [1, 2, 3].map((k) => (
                <div
                  key={`beat-${b}-${k}`}
                  className="absolute inset-y-0 z-0 border-l border-white/[0.02]"
                  style={{ left: `${b * PX_PER_BAR + (k * PX_PER_BAR) / 4}px` }}
                />
              )),
            )}

            {/* one lane per track */}
            {tracks.map((track) => (
              <div
                key={track.id}
                className="relative z-10 border-b border-white/5"
                style={{ height: `${LANE_H}px` }}
              >
                {track.clips.map((clip) => (
                  <ClipView key={clip.id} clip={clip} />
                ))}
              </div>
            ))}

            {/* playhead */}
            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-px bg-accent"
              style={{ left: `${playheadX}px` }}
            >
              <div className="absolute -left-[3px] top-0 h-0 w-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
