import type { Arc } from "../shapes/Arc"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArc(shape: any): shape is Arc {
  return shape?.constructor?.type === "Arc"
}
