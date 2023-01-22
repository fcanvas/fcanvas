import type { Rect } from "../type/Rect"

export function isRectRaw(shape: any): shape is Rect {
  return (
    shape != null &&
    "x" in shape &&
    "y" in shape &&
    "width" in shape &&
    "height" in shape
  )
}
