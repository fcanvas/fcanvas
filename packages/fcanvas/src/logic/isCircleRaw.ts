import type { Circle } from "../type/Circle"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCircleRaw(shape: any): shape is Circle {
  return shape != null && "x" in shape && "y" in shape && "radius" in shape
}
