import { ChevronDown, ChevronRight } from "lucide-react";
import type { Bus, Group, Project, Track } from "@/lib/types";
import { TRACK_HEX } from "@/lib/types";
import { ChannelStrip } from "./ChannelStrip";
import { rgba } from "./util";

interface GroupPanelProps {
  project: Project;
  group: Group;
  width: number;
  showInserts: boolean;
  showSends: boolean;
  compact?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

/** A tinted folder of channel strips plus its summing bus strip. */
export function GroupPanel({
  project,
  group,
  width,
  showInserts,
  showSends,
  compact,
  collapsed,
  onToggle,
}: GroupPanelProps) {
  const hex = TRACK_HEX[group.color];
  const bus = project.buses.find((b) => b.id === group.busId);
  const tracks = group.trackIds
    .map((id) => project.tracks.find((t) => t.id === id))
    .filter((t): t is Track => Boolean(t));
  const busName = bus?.name ?? "Bus";
  const expanded = !collapsed;

  return (
    <div
      className="flex h-full shrink-0 flex-col gap-2 rounded-xl border p-2"
      style={{ background: rgba(hex, 0.06), borderColor: rgba(hex, 0.18) }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex h-7 flex-none items-center gap-1.5 rounded-md border px-2"
        style={{ background: rgba(hex, 0.14), borderColor: rgba(hex, 0.26) }}
      >
        <span className="flex-none" style={{ color: hex }}>
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
        <span
          className="h-2 w-2 flex-none rounded-sm"
          style={{ background: hex }}
        />
        <span className="truncate text-[11px] font-semibold tracking-tight text-ink">
          {group.name}
        </span>
        <span className="flex-1" />
        {expanded && (
          <span className="truncate text-[10px] text-ink-muted">
            ↳ {busName} → Master
          </span>
        )}
        <span className="flex-none font-mono text-[9px] text-ink-muted">
          {expanded
            ? `${group.trackIds.length} tracks`
            : `+${group.trackIds.length}`}
        </span>
      </button>

      <div className="flex min-h-0 flex-1 items-stretch gap-2">
        {expanded &&
          tracks.map((track) => (
            <ChannelStrip
              key={track.id}
              data={track}
              color={track.color}
              isBus={false}
              width={width}
              showInserts={showInserts}
              showSends={showSends}
              compact={compact}
              outputName={busName}
              outputColor={hex}
            />
          ))}
        {bus && (
          <ChannelStrip
            data={bus as Bus}
            color={bus.color}
            isBus
            width={width}
            showInserts={showInserts}
            showSends={showSends}
            compact={compact}
            outputName="Master"
            outputColor={TRACK_HEX.master}
          />
        )}
      </div>
    </div>
  );
}
