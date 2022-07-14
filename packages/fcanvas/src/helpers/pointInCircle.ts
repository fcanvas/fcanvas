export function pointInCircle(
  x0: number,
  y0: number,
  x: number,
  y: number,
  r: number
): boolean {
  const distance = (x0 - x) ** 2 + (y0 - y) ** 2
  return distance <= r ** 2
}
