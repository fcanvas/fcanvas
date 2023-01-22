import type { Circle } from "../shapes/Circle"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCircle(shape: any): shape is Circle {
  return shape?.constructor?.type === "Circle"
}
