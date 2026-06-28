import { useEffect } from "react";
import { Button, Input, Kbd } from "@heroui/react";
import type { DiffChange, Project } from "@/lib/types";
import { TRACK_HEX } from "@/lib/types";
import { SparkleBadge } from "@/components/primitives";

interface SpotlightProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

/** Delta text color keyed by change direction (matches the design tokens). */
function deltaClass(direction: DiffChange["direction"]): string {
  if (direction === "down") return "text-[#e8856f]";
  if (direction === "up") return "text-success";
  return "text-ink-secondary";
}

/** ⌘K command palette: a glass spotlight over a dimmed session. */
export function Spotlight({ open, onClose, project }: SpotlightProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative mx-auto mt-[14vh] w-[600px] overflow-hidden rounded-2xl bg-overlay/90 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
      >
        {/* command input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-accent to-[#0a64d6] shadow-[0_0_14px_rgba(41,151,255,0.45)]">
            <SparkleBadge size={13} className="text-white" />
          </span>
          <Input
            autoFocus
            variant="secondary"
            className="flex-1 border-0 bg-transparent text-base text-ink shadow-none"
            placeholder="Ask Aria to edit your session…"
          />
          <Kbd>
            <Kbd.Abbr keyValue="command" />
            <Kbd.Abbr keyValue="enter" />
          </Kbd>
        </div>

        {/* result */}
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px_var(--color-success,#54c98a)]" />
              Suggested
            </span>
            <span className="text-xs text-ink-secondary">
              {project.diff.title} across 3 tracks · isolated to the{" "}
              {project.diff.section}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-sunken">
            <div className="divide-y divide-white/5">
              {project.diff.changes.map((change) => (
                <div
                  key={change.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span
                    className="h-[9px] w-[9px] shrink-0 rounded-[2px]"
                    style={{ background: TRACK_HEX[change.color] }}
                  />
                  <span className="w-[118px] shrink-0 text-[13px] font-medium text-ink">
                    {change.trackName}
                  </span>
                  <span className="flex-1 text-xs text-ink-muted">
                    {change.description}
                  </span>
                  <span
                    className={`shrink-0 font-mono text-[11px] font-semibold ${deltaClass(change.direction)}`}
                  >
                    {change.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* footer */}
          <div className="mt-4 flex items-center gap-2">
            <span className="flex-1 text-[11px] text-ink-dim">
              ↑↓ navigate · A/B audition · esc to dismiss
            </span>
            <Button variant="secondary" size="sm">
              Preview
            </Button>
            <Button variant="ghost" size="sm" onPress={onClose}>
              Discard
            </Button>
            <Button variant="primary" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
