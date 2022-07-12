export function constrain(value: number, min: number, max: number): number {
  return Math.min(Math.max(min, value), max)
}
