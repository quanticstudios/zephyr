import { useState } from "react";
import type { MasterChannel } from "@/lib/types";
import { Fader, LED, Meter } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { InsertRack } from "./InsertRack";
import { dbToFader, fmtSigned, formatDb } from "./util";

interface MasterStripProps {
  master: MasterChannel;
}

/** The pinned master bus: loudness readout, master chain, fader and metering. */
export function MasterStrip({ master }: MasterStripProps) {
  const [dim, setDim] = useState(false);
  const [mono, setMono] = useState(false);

  return (
    <div className="sticky right-0 z-10 flex h-full w-[168px] shrink-0 flex-col gap-2 rounded-lg border border-border bg-strip p-2 shadow-[-14px_0_28px_rgba(0,0,0,0.45)]">
      <span className="text-center text-[8px] font-bold uppercase tracking-widest text-ink-muted">
        Output
      </span>

      {/* cap */}
      <div className="flex-none rounded-md bg-track-master py-1.5 text-center">
        <span className="text-[12px] font-bold tracking-tight text-[#16161a]">
          Master
        </span>
      </div>

      {/* loudness readout */}
      <div className="flex flex-none flex-col gap-1.5 rounded-md bg-well p-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-wide text-ink-dim">
            LUFS-I
          </span>
          <span className="font-mono text-[16px] font-bold text-accent">
            {fmtSigned(master.lufsIntegrated)}
          </span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-baseline justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-wide text-ink-dim">
            True Pk
          </span>
          <span className="font-mono text-[11px] font-semibold text-ink">
            {fmtSigned(master.truePeak)} dB
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-wide text-ink-dim">
            GR
          </span>
          <span className="font-mono text-[11px] font-semibold text-success">
            {fmtSigned(master.gainReduction)} dB
          </span>
        </div>
      </div>

      {/* master chain */}
      <div className="flex-none">
        <span className="mb-1 block text-[8px] font-bold uppercase tracking-wide text-ink-muted">
          Master Chain
        </span>
        <InsertRack inserts={master.inserts} />
      </div>

      {/* fader bay */}
      <div className="flex min-h-44 flex-1 justify-center gap-2 px-1 py-2">
        <div className="h-full">
          <Fader value={dbToFader(master.volumeDb)} />
        </div>
        <Meter levelL={master.meterL} levelR={master.meterR} scale />
      </div>

      {/* dB readout */}
      <div className="flex-none rounded bg-black/25 py-1 text-center font-mono text-[11px] font-bold text-ink">
        {formatDb(master.volumeDb)}
      </div>

      {/* dim / mono */}
      <div className="flex flex-none gap-1.5">
        <button
          type="button"
          onClick={() => setDim((v) => !v)}
          className={cn(
            "flex-1 rounded py-1 text-center text-[9px] font-bold",
            dim
              ? "bg-accent/15 text-accent ring-1 ring-accent/30"
              : "bg-black/30 text-ink-muted",
          )}
        >
          DIM
        </button>
        <button
          type="button"
          onClick={() => setMono((v) => !v)}
          className={cn(
            "flex-1 rounded py-1 text-center text-[9px] font-bold",
            mono
              ? "bg-accent/15 text-accent ring-1 ring-accent/30"
              : "bg-black/30 text-ink-muted",
          )}
        >
          MONO
        </button>
      </div>

      {/* footer */}
      <div className="flex flex-none items-center justify-center gap-1.5 rounded-md bg-black/25 py-1.5">
        <LED color="var(--color-success)" size={7} />
        <span className="text-[8.5px] text-ink-secondary">Main Output</span>
      </div>
    </div>
  );
}
