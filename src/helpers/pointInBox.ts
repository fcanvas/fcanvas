export function pointInBox(
  x0: number,
  y0: number,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const x1 = Math.min(x, x + w);
  const x2 = Math.max(x, x + w);
  const y1 = Math.min(y, y + h);
  const y2 = Math.max(y, y + h);

  return x1 <= x0 && x0 <= x2 && y1 <= y0 && y0 <= y2;
}
