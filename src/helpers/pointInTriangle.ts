function checkClockwise(x1: number, y1: number, x2: number, y2: number) {
  return -y1 * x2 + y1 * (-x1 + x2) + x1 * (y1 - y2) + x1 * y2 > 0;
}

function pointInTriangleClock(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  return (
    (((y2 - y1) * (x - x1) - (x2 - x1) * (y - y1)) |
      ((y3 - y2) * (x - x2) - (x3 - x2) * (y - y2)) |
      ((y1 - y3) * (x - x3) - (x1 - x3) * (y - y3))) >=
    0
  );
}

export function pointInTriangle(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  return checkClockwise(x1, y1, x2, y2)
    ? pointInTriangleClock(x, y, x1, y1, x3, y3, x2, y2)
    : pointInTriangleClock(x, y, x1, y1, x2, y2, x3, y3);
}
