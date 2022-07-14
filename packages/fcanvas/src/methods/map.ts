import { clamp } from "./clamp"

export function map(
  value: number,
  start: number,
  stop: number,
  min: number,
  max: number,
  withinBounds?: boolean
): number {
  const newVal = ((value - start) * (max - min)) / (stop - start) + min

  if (!withinBounds) return newVal

  if (min < max) return clamp(newVal, min, max)

  return clamp(newVal, max, min)
}
