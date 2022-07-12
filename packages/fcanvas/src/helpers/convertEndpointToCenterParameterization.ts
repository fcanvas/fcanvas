function vMag(v: number[]) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

function vRatio(u: number[], v: number[]) {
  return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v))
}

function vAngle(u: number[], v: number[]) {
  return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v))
}

export function convertEndpointToCenterParameterization(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  fa: number,
  fs: number,
  rx: number,
  ry: number,
  psiDeg: number
) {
  // Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
  const psi = psiDeg * (Math.PI / 180.0)
  const xp =
    (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0
  const yp =
    (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 + (Math.cos(psi) * (y1 - y2)) / 2.0

  const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry)

  if (lambda > 1) {
    rx *= Math.sqrt(lambda)
    ry *= Math.sqrt(lambda)
  }

  // eslint-disable-next-line functional/no-let
  let f = Math.sqrt(
    (rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
      (rx * rx * (yp * yp) + ry * ry * (xp * xp))
  )

  if (fa === fs) f *= -1

  if (isNaN(f)) f = 0

  const cxp = (f * rx * yp) / ry
  const cyp = (f * -ry * xp) / rx

  const cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp
  const cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp

  const theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry])
  const u = [(xp - cxp) / rx, (yp - cyp) / ry]
  const v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry]
  // eslint-disable-next-line functional/no-let
  let dTheta = vAngle(u, v)

  if (vRatio(u, v) <= -1) dTheta = Math.PI

  if (vRatio(u, v) >= 1) dTheta = 0

  if (fs === 0 && dTheta > 0) dTheta = dTheta - 2 * Math.PI

  if (fs === 1 && dTheta < 0) dTheta = dTheta + 2 * Math.PI

  return [cx, cy, rx, ry, theta, dTheta, psi, fs]
}
