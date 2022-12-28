import { BOUNCE_CLIENT_RECT } from "../symbols"
import type { Rect } from "../type/Rect"

export interface BoxClientRect {
  [BOUNCE_CLIENT_RECT]: { value: Rect }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBoxClientRect(box: any): box is BoxClientRect {
  return (box as BoxClientRect)?.[BOUNCE_CLIENT_RECT] !== undefined
}
