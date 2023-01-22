import { Circle } from "../shapes/Circle"

export function isCircle(shape: any): shape is Circle {
  return shape?.constructor?.type === "Circle"
}
