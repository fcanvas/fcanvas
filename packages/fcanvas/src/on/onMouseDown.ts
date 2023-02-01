import type { NOOP } from "@vue/shared"

import type { Group } from "../Group"
import type { Shape } from "../Shape"
import { getCurrentShape } from "../currentShape"
import { addEvents } from "../helpers/addEvents"
import { rmEvents } from "../helpers/rmEvents"
import { tryOnScopeDispose } from "../logic/tryOnScopeDispose"
/**
 * `onMouseDown` is a function that takes a `Shape` and a callback, and returns a function that removes
 * the event listener
 * @param {Shape | Group | ((event: MouseEvent | TouchEvent) => void)} target - Shape | ((event: MouseEvent |
 * TouchEvent) => void)
 * @param [cb] - (event: MouseEvent | TouchEvent) => void
 * @returns A function that removes the event listener.
 */

function onMouseDown(
  target: Shape | Group,
  cb: (event: MouseEvent | TouchEvent) => void
): typeof NOOP
// eslint-disable-next-line no-redeclare
function onMouseDown(cb: (event: MouseEvent | TouchEvent) => void): typeof NOOP

// eslint-disable-next-line no-redeclare
function onMouseDown(
  target: Shape | Group | ((event: MouseEvent | TouchEvent) => void),
  cb?: (event: MouseEvent | TouchEvent) => void
) {
  if (cb === undefined) {
    ;[target, cb] = [
      getCurrentShape(),
      target as (event: MouseEvent | TouchEvent) => void
    ]
  }

 const stop=  addEvents(
    target as Shape,
    ["mousedown", "touchstart"],
    cb as (event: Event) => void
  )

  tryOnScopeDispose(stop)

  return stop
}

export { onMouseDown }
