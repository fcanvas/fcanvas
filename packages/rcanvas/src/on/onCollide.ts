import { watchPostEffect } from "vue"

import type { Shape } from "../Shape"
import { getCurrentShape } from "../currentShape"
import { haveIntersection } from "../methods/haveIntersection"
import type { BOUNCE_CLIENT_RECT } from "../symbols"

interface Checks<T> {
  forEach: (cb: (el: T, index: number) => void) => void
}
interface Cb<T> {
  (el: T, index: number): void
}

function onCollide<T extends Pick<Shape, typeof BOUNCE_CLIENT_RECT>>(
  checks: Checks<T>,
  cb: Cb<T>
): void
// eslint-disable-next-line no-redeclare
function onCollide<T extends Pick<Shape, typeof BOUNCE_CLIENT_RECT>>(
  target: Shape,
  checks: Checks<T>,
  cb: Cb<T>
): void

// eslint-disable-next-line no-redeclare
function onCollide<T extends Pick<Shape, typeof BOUNCE_CLIENT_RECT>>(
  target: Shape | Checks<T>,
  checks: Checks<T> | Cb<T>,
  cb?: Cb<T>
) {
  if (cb === undefined) {
    ;[target, checks, cb] = [
      getCurrentShape(),
      target as Checks<T>,
      checks as Cb<T>
    ]
  }

  return watchPostEffect(() => {
    ;(checks as Checks<T>).forEach((el, index) => {
      if (haveIntersection(target as Shape, el)) {
        // ok
        ;(cb as Cb<T>)(el, index)
      }
    })
  })
}

export { onCollide }
