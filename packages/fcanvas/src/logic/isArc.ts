import type { Arc } from "../shapes/Arc"

export function isArc(shape: any): shape is Arc {
  return shape?.constructor?.type === "Arc"
}
