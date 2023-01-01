import type { BoxClientRect } from "../logic/isBoxClientRect"
import { BOUNDING_CLIENT_RECT } from "../symbols"

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
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  )
}
