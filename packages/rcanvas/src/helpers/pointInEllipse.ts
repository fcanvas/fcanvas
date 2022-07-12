export function pointInEllipse(
  x: number,
  y: number,
  h: number,
  k: number,
  a: number,
  b: number
) {
  // checking the equation of
  // ellipse with the given point
  const p =
    parseInt((x - h) ** 2 + "") / parseInt(a ** 2 + "") +
    parseInt((y - k) ** 2 + "") / parseInt(b ** 2 + "")

  return p <= 1
}
