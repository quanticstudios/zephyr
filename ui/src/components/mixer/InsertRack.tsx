import type { Insert } from "@/lib/types";
import { LED, SparkleBadge } from "@/components/primitives";
import { cn } from "@/lib/cn";

interface InsertRackProps {
  inserts: Insert[];
}

/** Vertical list of plugin insert slots, capped by a dashed "+ Insert" row. */
export function InsertRack({ inserts }: InsertRackProps) {
  return (
    <div className="flex flex-col">
      {inserts.map((insert) => (
        <div
          key={insert.id}
          className={cn(
            "mb-1 flex items-center gap-1.5 rounded border px-1.5 py-1",
            insert.aiEdited
              ? "border-accent/30 bg-accent/10"
              : "border-white/5 bg-well",
          )}
        >
          <LED
            on={insert.enabled}
            color={insert.aiEdited ? "var(--color-accent)" : "var(--color-success)"}
            size={5}
          />
          <span
            className={cn(
              "flex-1 truncate text-[10px]",
              insert.aiEdited ? "text-accent" : "text-ink-secondary",
            )}
          >
            {insert.name}
          </span>
          {insert.aiEdited && <SparkleBadge size={9} glow />}
        </div>
      ))}
      <button
        type="button"
        className="mt-px flex items-center justify-center gap-1 rounded border border-dashed border-white/15 py-1 text-[9px] font-medium text-ink-muted transition-colors hover:border-white/25 hover:text-ink-secondary"
      >
        + Insert
      </button>
    </div>
  );
}
