import type { BoxClientRect } from "../logic/isBoxClientRect"
import { BOUNDING_CLIENT_RECT } from "../symbols"
import type { Rect } from "../type/Rect"

export function haveIntersection(
  el1: BoxClientRect,
  el2: BoxClientRect
): boolean {
  const r1 = el1[BOUNDING_CLIENT_RECT].value
  const r2 = el2[BOUNDING_CLIENT_RECT].value

  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((el1.constructor as unknown as any).type === "Arc" ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el1.constructor as unknown as any).type === "Circle") &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((el2.constructor as unknown as any).type === "Arc" ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el2.constructor as unknown as any).type === "Circle")
  ) {
    const rd1 =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el1 as unknown as any).$.outerRadius ?? (el1 as unknown as any).$.radius
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { x: x1, y: y1 } = (el1 as unknown as any).$
    const rd2 =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el2 as unknown as any).$.outerRadius ?? (el2 as unknown as any).$.radius
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { x: x2, y: y2 } = (el2 as unknown as any).$

    return (rd1 + rd2) ** 2 >= (x1 - y1) ** 2 + (x2 - y2) ** 2
  }

  return checkRect(r1, r2) || checkRect(r2, r1)
}

export function checkRect(r1: Rect, r2: Rect): boolean {
  const { x: x1, y: y1 } = r1
  const maxX1 = r1.width + x1
  const maxY1 = r1.height + y1

  const { x: x2, y: y2 } = r2
  const maxX2 = r2.width + x2
  const maxY2 = r2.height + y2

  const eq1 = y1 >= y2 && y1 <= maxY2
  const eq2 = x1 >= x2 && x1 <= maxX2

  if (eq1 && eq2) return true
  const eq3 = maxX1 >= x2 && maxX1 <= maxX2

  if (eq1 && eq3) return true
  const eq4 = maxY1 >= y2 && maxY1 <= maxY2

  if (eq4 && eq3) return true
  if (eq4 && eq2) return true

  return false
}
