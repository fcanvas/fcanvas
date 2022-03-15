function QB1(t: number) {
  return t * t;
}
function QB2(t: number) {
  return 2 * t * (1 - t);
}
function QB3(t: number) {
  return (1 - t) ** 2;
}

export function getPointOnQuadraticBezier(
  pct: number,
  P1x: number,
  P1y: number,
  P2x: number,
  P2y: number,
  P3x: number,
  P3y: number
) {
  const x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
  const y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);

  return {
    x,
    y,
  };
}
