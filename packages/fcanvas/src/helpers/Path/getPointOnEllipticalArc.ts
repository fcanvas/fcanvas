export function getPointOnEllipticalArc(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  theta: number,
  psi: number
) {
  const cosPsi = Math.cos(psi)
  const sinPsi = Math.sin(psi)
  const pt = {
    x: rx * Math.cos(theta),
    y: ry * Math.sin(theta)
  }
  return {
    x: cx + (pt.x * cosPsi - pt.y * sinPsi),
    y: cy + (pt.x * sinPsi + pt.y * cosPsi)
  }
}
