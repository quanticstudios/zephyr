import { useState } from "react";
import { Button } from "@heroui/react";
import type { Diff, DiffChange } from "@/lib/types";
import { TRACK_HEX } from "@/lib/types";
import { Pill } from "@/components/primitives";
import { cn } from "@/lib/cn";

/** Delta text color keyed by change direction (matches the design tokens). */
function deltaClass(direction: DiffChange["direction"]): string {
  if (direction === "down") return "text-[#e8856f]";
  if (direction === "up") return "text-success";
  return "text-ink-secondary";
}

/** AI proposed-edit summary card: title + section pill, change rows, action footer. */
export function DiffCard({ diff }: { diff: Diff }) {
  const [applied, setApplied] = useState(false);

  return (
    <div className="bg-sunken rounded-xl border border-border overflow-hidden">
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-medium text-ink">{diff.title}</span>
        <Pill active>{diff.section}</Pill>
      </div>

      <div className="divide-y divide-white/5">
        {diff.changes.map((change) => (
          <div key={change.id} className="px-3 py-2 flex items-center gap-2">
            <span
              className="h-[9px] w-[9px] shrink-0 rounded-[2px]"
              style={{ background: TRACK_HEX[change.color] }}
            />
            <div className="min-w-0">
              <div className="text-xs text-ink">{change.trackName}</div>
              <div className="text-[10px] text-ink-muted">{change.description}</div>
            </div>
            <span
              className={cn(
                "ml-auto shrink-0 font-mono text-[11px] font-semibold",
                deltaClass(change.direction),
              )}
            >
              {change.delta}
            </span>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 flex gap-2 border-t border-white/5">
        <Button variant="secondary" size="sm" className="flex-1">
          Preview
        </Button>
        <Button variant="ghost" size="sm">
          Undo
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onPress={() => setApplied(true)}
        >
          {applied ? "Applied ✓" : "Apply"}
        </Button>
      </div>
    </div>
  );
}
