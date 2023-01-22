import type { Rect } from "../type/Rect"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRectRaw(shape: any): shape is Rect {
  return (
    shape != null &&
    "x" in shape &&
    "y" in shape &&
    "width" in shape &&
    "height" in shape
  )
}
