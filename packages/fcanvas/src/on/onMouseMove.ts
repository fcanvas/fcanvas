import type { NOOP } from "@vue/shared"

import type { Shape } from "../Shape"
import { getCurrentShape } from "../currentShape"
import { addEvents } from "../helpers/addEvents"
import { rmEvents } from "../helpers/rmEvents"

function onMouseMove(
  target: Shape,
  cb: (event: MouseEvent | TouchEvent) => void
): typeof NOOP
// eslint-disable-next-line no-redeclare
function onMouseMove(cb: (event: MouseEvent | TouchEvent) => void): typeof NOOP

// eslint-disable-next-line no-redeclare
function onMouseMove(
  target: Shape | ((event: MouseEvent | TouchEvent) => void),
  cb?: (event: MouseEvent | TouchEvent) => void
) {
  if (cb === undefined) {
    ;[target, cb] = [getCurrentShape(), target as (event: MouseEvent | TouchEvent) => void]
  }

  addEvents(
    target as Shape,
    ["mousemove", "touchmove"],
    cb as (event: Event) => void
  )

  return () =>
    rmEvents(
      target as Shape,
      ["mousemove", "touchmove"],
      cb as (event: Event) => void
    )
}

export { onMouseMove }
