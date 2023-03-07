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
): DOMMatrix | null {
  if (
    options.scale !== undefined &&
    options.rotation !== undefined &&
    options.offset !== undefined &&
    useTranslate !== undefined &&
    options.skewX !== undefined &&
    options.skewY !== undefined
  )
    return null
  const transform = new DOMMatrix()

  if (options.scale) transform.scaleSelf(options.scale.x, options.scale.y)
  if (options.rotation) transform.rotateSelf(convertToDegrees(options.rotation))
  if (options.offset !== undefined || useTranslate) {
    transform.translateSelf(
      (options.offset?.x ?? 0) + (options.x ?? 0),
      (options.offset?.y ?? 0) + (options.y ?? 0)
    )
  }
  if (options.skewX !== undefined) transform.skewXSelf(options.skewX)
  if (options.skewY !== undefined) transform.skewYSelf(options.skewY)

  return transform
}
