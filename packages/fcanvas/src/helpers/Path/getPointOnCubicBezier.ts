function CB1(t: number) {
  return t ** 3
}
function CB2(t: number) {
  return 3 * t ** 2 * (1 - t)
}
function CB3(t: number) {
  return 3 * t * (1 - t) ** 2
}
function CB4(t: number) {
  return (1 - t) * (1 - t) ** 2
}

export function getPointOnCubicBezier(
  pct: number,
  P1x: number,
  P1y: number,
  P2x: number,
  P2y: number,
  P3x: number,
  P3y: number,
  P4x: number,
  P4y: number
) {
  const x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct)
  const y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct)

  return {
    x,
    y
  }
}
