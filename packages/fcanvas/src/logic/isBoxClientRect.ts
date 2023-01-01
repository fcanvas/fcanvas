import type { Rect } from "../type/Rect"

export interface BoxClientRect {
  getBoundingClientRect: () => Rect
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBoxClientRect(box: any): box is BoxClientRect {
  return (box as BoxClientRect)?.getBoundingClientRect() !== undefined
}
