import type { ReactNode } from "react";
import { Segmented, type SegmentedOption } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { project } from "@/lib/project";
import type { WorkspaceView } from "@/lib/types";

const MODES: SegmentedOption<WorkspaceView>[] = [
  { key: "arrange", label: "Arrange" },
  { key: "mix", label: "Mix" },
  { key: "split", label: "Split" },
  { key: "session", label: "Session" },
];

/** Workspace mode switcher + arrangement summary + edit-grid chips. */
export function ModeNav({
  view,
  onViewChange,
}: {
  view: WorkspaceView;
  onViewChange: (v: WorkspaceView) => void;
}) {
  return (
    <nav className="flex h-10 items-center gap-3.5 border-b border-border bg-rail/80 px-3.5 backdrop-blur-md">
      <Segmented
        options={MODES}
        value={view}
        onChange={onViewChange}
        className="border border-white/10"
      />
      <span className="h-[18px] w-px bg-white/10" />
      <div className="flex items-center gap-2 text-[11.5px] text-ink-muted">
        <span className="font-medium text-ink-secondary">
          {project.tracks.length} tracks
        </span>
        <span>·</span>
        <span>{project.buses.length} buses</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Chip>Snap 1/4</Chip>
        <Chip>Grid</Chip>
        <Chip active>Automation</Chip>
      </div>
    </nav>
  );
}

function Chip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-2.5 py-1 text-[11px] transition-colors",
        active
          ? "bg-accent/10 text-accent"
          : "border border-white/10 text-ink-muted hover:text-ink-secondary",
      )}
    >
      {children}
    </button>
  );
}
