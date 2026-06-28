import { useState } from "react";
import type { Project } from "@/lib/types";
import { Pill, Segmented, SparkleBadge } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { GroupPanel } from "./GroupPanel";
import { MasterStrip } from "./MasterStrip";

type SizeKey = "S" | "M" | "L";
const WIDTHS: Record<SizeKey, number> = { S: 100, M: 116, L: 150 };
const SIZE_OPTIONS = [
  { key: "S" as const, label: "S" },
  { key: "M" as const, label: "M" },
  { key: "L" as const, label: "L" },
];

interface MixConsoleProps {
  project: Project;
  compact?: boolean;
}

/** The Mix Console: folder groups of channel strips with a pinned master. */
export function MixConsole({ project, compact }: MixConsoleProps) {
  const [showInserts, setShowInserts] = useState(!compact);
  const [showSends, setShowSends] = useState(!compact);
  const [size, setSize] = useState<SizeKey>("M");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const width = WIDTHS[size];
  const changeCount = project.diff.changes.length;

  const collapseAll = () =>
    setCollapsed(
      Object.fromEntries(project.groups.map((g) => [g.id, true])),
    );
  const expandAll = () => setCollapsed({});
  const toggleGroup = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleBtn = (active: boolean) =>
    cn(
      "rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors",
      active
        ? "border-accent/30 bg-accent/10 text-accent"
        : "border-border text-ink-muted hover:text-ink-secondary",
    );

  return (
    <div className="flex h-full flex-col bg-panel">
      {/* HEADER */}
      <div
        className={cn(
          "flex flex-none items-center gap-3 border-b border-border bg-rail px-3",
          compact ? "h-10" : "h-12",
        )}
      >
        <span className="text-sm font-semibold tracking-tight">Console</span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowInserts((v) => !v)}
            className={toggleBtn(showInserts)}
          >
            Inserts
          </button>
          <button
            type="button"
            onClick={() => setShowSends((v) => !v)}
            className={toggleBtn(showSends)}
          >
            Sends
          </button>
        </div>

        <span className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-md border border-border px-2.5 py-1.5 text-[11px] text-ink-muted transition-colors hover:text-ink-secondary"
          >
            Collapse All
          </button>
          <button
            type="button"
            onClick={expandAll}
            className="rounded-md border border-border px-2.5 py-1.5 text-[11px] text-ink-muted transition-colors hover:text-ink-secondary"
          >
            Expand All
          </button>
        </div>

        <span className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-wide text-ink-dim">Width</span>
          <Segmented
            options={SIZE_OPTIONS}
            value={size}
            onChange={setSize}
            size="sm"
          />
        </div>

        {/* AI banner */}
        <Pill
          active
          className="ml-auto gap-2.5 border border-accent/30 bg-accent/10 py-1 pl-3 pr-1.5 text-[12px]"
        >
          <SparkleBadge size={12} />
          <span className="text-[12px] text-ai-soft">
            Assistant changed{" "}
            <span className="font-semibold text-white">
              {changeCount} settings
            </span>{" "}
            in the {project.section}
          </span>
          <button
            type="button"
            className="rounded-full border border-ai-soft/30 px-2.5 py-0.5 text-[11px] text-ai-soft transition-colors hover:bg-ai-soft/10"
          >
            Review
          </button>
          <button
            type="button"
            className="px-2 py-0.5 text-[11px] text-ink-muted transition-colors hover:text-ink-secondary"
          >
            Undo
          </button>
        </Pill>
      </div>

      {/* BODY — groups scroll horizontally; master stays pinned at the right */}
      <div className="flex min-h-0 flex-1">
        <div className="flex flex-1 items-stretch gap-3 overflow-x-auto p-3">
          {project.groups.map((group) => (
            <GroupPanel
              key={group.id}
              project={project}
              group={group}
              width={width}
              showInserts={showInserts}
              showSends={showSends}
              compact={compact}
              collapsed={!!collapsed[group.id]}
              onToggle={() => toggleGroup(group.id)}
            />
          ))}
        </div>
        <div className="flex flex-none items-stretch border-l border-border p-3">
          <MasterStrip master={project.master} />
        </div>
      </div>
    </div>
  );
}
