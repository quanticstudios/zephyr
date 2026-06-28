import { useState, type ReactNode } from "react";
import { Circle, Play, Repeat, SkipBack, Square } from "lucide-react";
import { Kbd } from "@heroui/react";
import { Pill, SparkleBadge } from "@/components/primitives";
import { cn } from "@/lib/cn";
import type { Project, WorkspaceView } from "@/lib/types";

const TRAFFIC = ["#ff5f57", "#febc2e", "#28c840"];

/** macOS-style window chrome: identity + project label, centered transport, telemetry. */
export function TopBar({
  project,
  view,
  onAssistant,
}: {
  project: Project;
  view: WorkspaceView;
  onAssistant?: () => void;
}) {
  return (
    <header
      data-view={view}
      className="flex h-12 items-center gap-3.5 border-b border-border bg-rail px-3.5"
    >
      {/* LEFT — identity + project */}
      <div className="flex min-w-[300px] items-center gap-[11px]">
        <div className="flex items-center gap-[7px]">
          {TRAFFIC.map((c) => (
            <span
              key={c}
              className="size-[11px] rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="ml-1.5 flex items-center gap-2">
          <span className="text-[14px] font-semibold tracking-tight text-ink">
            Aria
          </span>
          <span className="h-4 w-px bg-white/10" />
          <span className="text-[12.5px] tracking-tight text-ink-secondary">
            {project.name}
          </span>
          <span className="text-[11px] text-ink-dim">— {project.section}</span>
          <Pill className="border border-white/10 bg-transparent text-ink-dim">
            Saved
          </Pill>
        </div>
      </div>

      {/* CENTER — transport */}
      <div className="flex flex-1 justify-center">
        <Transport project={project} />
      </div>

      {/* RIGHT — telemetry + assistant + collaborators */}
      <div className="flex min-w-[300px] items-center justify-end gap-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] tabular-nums text-ink-muted">
          <span>CPU</span>
          <div className="h-[5px] w-[46px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[31%] rounded-full bg-success" />
          </div>
          <span className="text-ink-secondary">31%</span>
        </div>

        <div className="flex h-[22px] items-end gap-[3px] px-0.5">
          {[0.38, 0.48].map((cut, i) => (
            <div
              key={i}
              className="relative w-1 overflow-hidden rounded-[2px]"
              style={{
                height: "100%",
                background:
                  "linear-gradient(to top,#54c98a 0%,#54c98a 55%,#e8c466 78%,#ff453a 100%)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0"
                style={{ height: `${cut * 100}%`, background: "rgba(18,18,20,0.92)" }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAssistant}
          className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 py-1 pl-2.5 pr-3 transition-colors hover:bg-accent/25"
        >
          <SparkleBadge size={12} glow />
          <span className="text-xs font-medium tracking-tight text-accent">
            Assistant
          </span>
          <Kbd variant="light" className="text-[9px]">
            <Kbd.Abbr keyValue="command" />
            <Kbd.Content>K</Kbd.Content>
          </Kbd>
        </button>

        <div className="flex items-center">
          <Avatar initials="JK" gradient="linear-gradient(135deg,#6b8cff,#3a5bd9)" />
          <Avatar
            initials="M"
            gradient="linear-gradient(135deg,#ff8a6b,#d95a3a)"
            className="-ml-2"
          />
        </div>
      </div>
    </header>
  );
}

function Avatar({
  initials,
  gradient,
  className,
}: {
  initials: string;
  gradient: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-[26px] items-center justify-center rounded-full border-[1.5px] border-rail text-[10px] font-semibold text-white",
        className,
      )}
      style={{ background: gradient }}
    >
      {initials}
    </div>
  );
}

function Transport({ project }: { project: Project }) {
  const [loopOn, setLoopOn] = useState(true);
  const [metroOn, setMetroOn] = useState(false);

  return (
    <div className="flex h-[38px] items-stretch gap-1 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-elevated to-well px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_6px_rgba(0,0,0,0.4)]">
      {/* transport buttons */}
      <div className="flex items-center gap-1">
        <TransportButton label="Skip back">
          <SkipBack size={14} fill="currentColor" />
        </TransportButton>
        <button
          type="button"
          aria-label="Play"
          className="flex size-7 items-center justify-center rounded-full bg-gradient-to-b from-[#2b97ff] to-[#0a64d6] text-white shadow-[0_1px_5px_rgba(10,132,255,0.55),inset_0_1px_0_rgba(255,255,255,0.3)]"
        >
          <Play size={13} fill="currentColor" />
        </button>
        <TransportButton label="Stop">
          <Square size={13} fill="currentColor" />
        </TransportButton>
        <TransportButton label="Record" className="text-rec hover:text-rec">
          <Circle size={13} fill="currentColor" />
        </TransportButton>
      </div>

      <Divider />

      {/* timecode */}
      <div className="flex flex-col justify-center px-3">
        <div className="flex items-baseline gap-0.5 font-mono leading-none">
          <span className="text-[18px] font-bold tracking-wide text-ink">17</span>
          <span className="text-[13px] text-ink-faint">.</span>
          <span className="text-[18px] font-semibold text-ink-secondary">1</span>
          <span className="text-[13px] text-ink-faint">.</span>
          <span className="text-[18px] font-semibold text-ink-secondary">1</span>
          <span className="ml-2 text-[10px] font-medium text-ink-dim">0:36</span>
        </div>
        <div className="mt-[3px] text-[8px] font-semibold uppercase tracking-wide text-ink-faint">
          BAR · BEAT · TICK
        </div>
      </div>

      <Divider />

      {/* tempo */}
      <div className="flex flex-col justify-center px-3 leading-tight">
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono text-[13px] font-bold text-ink-secondary">
            {project.bpm}
          </span>
          <span className="text-[8px] font-semibold tracking-wide text-ink-dim">
            BPM
          </span>
        </div>
        <span className="mt-0.5 text-[8.5px] font-medium tracking-wide text-ink-muted">
          {project.timeSig}
        </span>
      </div>

      <Divider />

      {/* key */}
      <div className="flex flex-col justify-center px-3 leading-tight">
        <span className="text-[13px] font-bold tracking-tight text-accent">
          {project.key}
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-ink-faint">
          KEY · SCALE
        </span>
      </div>

      <Divider />

      {/* toggles */}
      <div className="flex items-center gap-1">
        <ToggleButton
          label="Loop"
          active={loopOn}
          onClick={() => setLoopOn((v) => !v)}
        >
          <Repeat size={15} />
        </ToggleButton>
        <ToggleButton
          label="Metronome"
          active={metroOn}
          onClick={() => setMetroOn((v) => !v)}
        >
          <MetronomeIcon />
        </ToggleButton>
      </div>
    </div>
  );
}

function Divider() {
  return <span className="w-px self-stretch bg-white/10" />;
}

function TransportButton({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex h-[26px] w-[27px] items-center justify-center rounded-md text-ink-muted transition-colors hover:text-ink-secondary",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-[26px] w-[27px] items-center justify-center rounded-md transition-colors",
        active
          ? "bg-accent/15 text-accent ring-1 ring-inset ring-accent/30"
          : "text-ink-muted hover:text-ink-secondary",
      )}
    >
      {children}
    </button>
  );
}

function MetronomeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.7 4h6.6l3 16h-12.6z" />
      <path d="M7.5 16h9" />
      <line
        x1="12"
        y1="16.5"
        x2="15.2"
        y2="6.5"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="15.2" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
