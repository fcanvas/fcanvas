import type { Circle } from "../type/Circle"

export function isCircleRaw(shape: any): shape is Circle {
  return shape != null && "x" in shape && "y" in shape && "radius" in shape
}
