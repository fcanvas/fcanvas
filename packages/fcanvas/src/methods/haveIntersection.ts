import type { BoxClientRect } from "../logic/isBoxClientRect"
import { BOUNCE_CLIENT_RECT } from "../symbols"

export function haveIntersection(
  el1: BoxClientRect,
  el2: BoxClientRect
): boolean {
  const r1 = el1[BOUNCE_CLIENT_RECT].value
  const r2 = el2[BOUNCE_CLIENT_RECT].value

  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  )
}
