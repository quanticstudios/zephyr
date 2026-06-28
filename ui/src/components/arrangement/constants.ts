import { project } from "@/lib/project";

/** Horizontal scale: pixels per musical bar across the arrangement timeline. */
export const PX_PER_BAR = 52;
/** Vertical height of a single track lane / track header row. */
export const LANE_H = 58;
/** The bar number that maps to x = 0 on the timeline (the first visible bar). */
export const ORIGIN_BAR = project.startBar;

/** Convert a #rrggbb hex string into an rgba() string with the given alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
