import { DEVICE_HEX, type Device } from "@/lib/types";
import { Knob, LED, SparkleBadge } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { ResponseCurve } from "./ResponseCurve";

interface DeviceCardProps {
  device: Device;
}

/** One plugin card in the device chain: colored title bar, kind/preset row,
   an optional response curve, and a 3-up grid of parameter knobs. */
export function DeviceCard({ device }: DeviceCardProps) {
  const color = DEVICE_HEX[device.kind];

  return (
    <div
      className={cn(
        "flex w-[160px] shrink-0 flex-col overflow-hidden rounded-lg bg-strip",
        device.aiEdited ? "border border-accent/45 ring-1 ring-accent/20" : "border border-border",
        device.enabled ? undefined : "opacity-60",
      )}
    >
      <div
        className="flex items-center gap-1 px-2 py-1 text-[#16161a]"
        style={{ background: color }}
      >
        <LED on={device.enabled} color="#f0f0f2" size={7} className="shrink-0" />
        <span className="flex-1 truncate text-[11px] font-medium tracking-[-0.1px]">
          {device.name}
        </span>
        {device.aiEdited && (
          <SparkleBadge size={9} className="shrink-0 text-ai-deep" />
        )}
      </div>

      <div className="flex items-center justify-between px-2 py-1 text-[9px] text-ink-muted">
        <span className="font-semibold uppercase tracking-wide">{device.kind}</span>
        {device.preset && <span className="text-ink-dim">{device.preset}</span>}
      </div>

      {device.graph && (
        <div className="px-2 pb-1">
          <ResponseCurve kind={device.graph} color={color} />
        </div>
      )}

      <div className="grid grid-cols-3 place-items-center gap-1 p-2">
        {device.params.map((p) => (
          <Knob
            key={p.id}
            value={p.value}
            display={p.display}
            label={p.label}
            aiEdited={p.aiEdited}
            color={color}
            size={26}
          />
        ))}
      </div>
    </div>
  );
}
