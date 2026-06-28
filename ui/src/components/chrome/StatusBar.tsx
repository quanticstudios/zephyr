import { LED } from "@/components/primitives";
import type { Project } from "@/lib/types";

/** Bottom engine/telemetry strip. */
export function StatusBar({
  project,
  modeLabel = "Assistant docked",
}: {
  project: Project;
  modeLabel?: string;
}) {
  return (
    <footer className="flex h-6 items-center gap-3 border-t border-border bg-rail px-3 text-[11px] text-ink-muted">
      <span className="flex items-center gap-1.5 text-success">
        <LED on color="var(--color-success)" size={6} />
        Engine: {project.engine} · {project.sampleRate}
      </span>
      <Sep />
      <span>Buffer 128 · 2.9 ms</span>
      <Sep />
      <span>Disk 14%</span>
      <span className="ml-auto">{modeLabel}</span>
      <Sep />
      <span className="font-mono text-ink-secondary">Out: −6.2 dB</span>
    </footer>
  );
}

function Sep() {
  return <span className="h-3 w-px bg-white/10" />;
}
