import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { ChevronLeft, Search } from "lucide-react";
import { Segmented, SparkleBadge } from "@/components/primitives";
import { TRACK_HEX } from "@/lib/types";
import type { Project } from "@/lib/types";

type BrowserTab = "sounds" | "loops" | "fx" | "files";

const TABS: { key: BrowserTab; label: string }[] = [
  { key: "sounds", label: "Sounds" },
  { key: "loops", label: "Loops" },
  { key: "fx", label: "FX" },
  { key: "files", label: "Files" },
];

/** Left library browser: source tabs, search, instruments and AI history lists. */
export function Browser({ project }: { project: Project }) {
  const [tab, setTab] = useState<BrowserTab>("sounds");

  return (
    <div className="w-[236px] shrink-0 bg-panel border-r border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
        <span className="text-sm font-semibold text-ink tracking-tight">
          Browser
        </span>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label="Collapse browser"
        >
          <ChevronLeft size={15} className="text-ink-dim" />
        </Button>
      </div>

      {/* Source tabs */}
      <div className="px-3 pb-1">
        <Segmented<BrowserTab>
          options={TABS}
          value={tab}
          onChange={setTab}
          size="sm"
          className="w-full"
        />
      </div>

      {/* Search well */}
      <div className="mx-3 mt-2 mb-1 flex items-center gap-2 rounded-full bg-well border border-border px-3 py-1.5">
        <Search size={13} className="shrink-0 text-ink-dim" />
        <Input
          variant="secondary"
          aria-label="Search your library"
          placeholder="Search your library"
          className="flex-1 min-w-0 border-0 bg-transparent p-0 text-[11px] text-ink shadow-none placeholder:text-ink-dim"
        />
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2">
        <div className="text-[8px] uppercase tracking-wide text-ink-muted my-2 px-2">
          Instruments
        </div>
        {project.browserInstruments.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 rounded-md px-2 py-1.5 cursor-default hover:bg-white/5"
          >
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ background: TRACK_HEX[item.color] }}
            />
            <span className="flex-1 min-w-0 truncate text-xs text-ink-secondary">
              {item.name}
            </span>
            <span className="ml-auto text-[10px] text-ink-dim">{item.tag}</span>
          </div>
        ))}

        <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-wide text-ink-muted my-2 px-2">
          <SparkleBadge size={9} />
          AI History
        </div>
        {project.aiHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 rounded-md px-2 py-1.5 cursor-default hover:bg-white/5"
          >
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_6px_rgba(41,151,255,0.6)]" />
            <span className="flex-1 min-w-0 truncate text-xs leading-snug text-ink-secondary">
              {item.text}
            </span>
            <span className="ml-auto shrink-0 text-[10px] text-ink-dim">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
