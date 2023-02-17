import { CONFIGS } from "../configs"
import type { Offset } from "../type/Offset"

import { convertToDegrees } from "./convertToDegrees"

export type OptionTransform = Partial<Offset> & {
  scale?: Partial<Offset>
  rotation?: number
  offset?: Partial<Offset>
  skewX?: number
  skewY?: number
}
export function createTransform(
  options: OptionTransform,
  useTranslate = false
): DOMMatrix {
  const transform = new CONFIGS.DOMMatrix()

  if (options.scale !== undefined)
    transform.scale(options.scale.x || 1, options.scale.y || 1)

  if (options.rotation !== undefined)
    transform.rotate(convertToDegrees(options.rotation))

  if (options.offset !== undefined || useTranslate) {
    transform.translate(
      options.offset?.x || 0 + (options.x ?? 0),
      options.offset?.y || 0 + (options.y ?? 0)
    )
  }
  if (options.skewX !== undefined) transform.skewX(options.skewX)

  if (options.skewY !== undefined) transform.skewY(options.skewY)

  return transform
}
