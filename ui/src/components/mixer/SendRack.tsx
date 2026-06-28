import type { Send } from "@/lib/types";
import { Knob } from "@/components/primitives";
import { cn } from "@/lib/cn";

interface SendRackProps {
  sends: Send[];
}

/** Vertical list of aux sends (mini knob + name + amount), capped by "+ Send". */
export function SendRack({ sends }: SendRackProps) {
  return (
    <div className="flex flex-col">
      {sends.map((send) => (
        <div key={send.id} className="mb-1.5 flex items-center gap-2">
          <Knob
            value={send.amount / 100}
            size={16}
            color={send.aiEdited ? "var(--color-accent)" : "#7a7a82"}
          />
          <span
            className={cn(
              "flex-1 truncate text-[10px]",
              send.aiEdited ? "text-accent" : "text-ink-secondary",
            )}
          >
            {send.name}
          </span>
          <span className="ml-auto font-mono text-[8.5px] text-ink-muted">
            {send.amount}%
          </span>
        </div>
      ))}
      <button
        type="button"
        className="mt-px flex items-center justify-center gap-1 rounded border border-dashed border-white/15 py-1 text-[9px] font-medium text-ink-muted transition-colors hover:border-white/25 hover:text-ink-secondary"
      >
        + Send
      </button>
    </div>
  );
}
