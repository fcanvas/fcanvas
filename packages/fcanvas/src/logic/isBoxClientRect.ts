import type { Rect } from "../type/Rect"

import { BOUNDING_CLIENT_RECT } from "./../symbols"

export interface BoxClientRect {
  [BOUNDING_CLIENT_RECT]: {
    value: Rect
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBoxClientRect(box: any): box is BoxClientRect {
  return typeof (box as BoxClientRect)?.[BOUNDING_CLIENT_RECT] !== "undefined"
}
