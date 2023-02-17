import { BOUNCE_CLIENT_RECT } from "../symbols"
import type { Rect } from "../type/Rect"

export function getBounceClientRect(bounce: {
  [BOUNCE_CLIENT_RECT]: {
    value: Rect
  }
}) {
  return bounce[BOUNCE_CLIENT_RECT].value
}
