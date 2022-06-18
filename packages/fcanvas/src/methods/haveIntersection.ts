import type { Offset } from "../types/Offset"
import type { Size } from "../types/Size"

export function haveIntersection(
  r1: Offset & Size,
  r2: Offset & Size
): boolean {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  )
}
