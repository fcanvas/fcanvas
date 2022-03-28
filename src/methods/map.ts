export function map(
  value: number,
  start: number,
  stop: number,
  min: number,
  max: number
): number {
  return ((value - start) * (max - min)) / (stop - start) + min;
}
