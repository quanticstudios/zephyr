/* Runtime geometry + formatting helpers for the Mix Console.
   These produce values for inline style (colors from data) and mono readouts. */

/** Convert a "#rrggbb" hex to an rgba() string with the given alpha. */
export function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Format a dB value like the console readouts: "−2.8 dB", "0.0 dB". */
export function formatDb(db: number): string {
  return `${db < 0 ? "−" : ""}${Math.abs(db).toFixed(1)} dB`;
}

/** Signed numeric (unicode minus), no unit — e.g. LUFS "−9.4". */
export function fmtSigned(n: number, decimals = 1): string {
  const sign = n < 0 ? "−" : n > 0 ? "+" : "";
  return `${sign}${Math.abs(n).toFixed(decimals)}`;
}

/** Pan label from a -1..1 value: "C", "L42", "R28". */
export function panLabel(pan: number): string {
  if (Math.abs(pan) < 0.02) return "C";
  return `${pan < 0 ? "L" : "R"}${Math.round(Math.abs(pan) * 100)}`;
}

/** Map a dB value to a 0..1 fader position (−24 dB → 0, +6 dB → 1). */
export function dbToFader(db: number): number {
  return Math.max(0, Math.min(1, (db + 24) / 30));
}

/** Map a -1..1 pan to a 0..1 knob value (centre = 0.5). */
export function panToKnob(pan: number): number {
  return Math.max(0, Math.min(1, (pan + 1) / 2));
}
