import { watchPostEffect } from "vue"

import type { Shape } from "../Shape"
import { haveIntersection } from "../methods/haveIntersection"
import type { BOUNCE_CLIENT_RECT } from "../symbols"

export function onCollide<T extends Pick<Shape, typeof BOUNCE_CLIENT_RECT>>(
  target: Shape,
  checks: {
    forEach: (cb: (el: T, index: number) => void) => void
  },
  cb: (el: T, index: number) => void
) {
  return watchPostEffect(() => {
    checks.forEach((el, index) => {
      if (haveIntersection(target, el)) {
        // ok
        cb(el, index)
      }
    })
  })
}
