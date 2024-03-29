import { watch } from "src/fns/watch"

import type { Group } from "../Group"
import type { Shape } from "../Shape"
import { haveIntersection } from "../auto-export"
import type { BoxClientRect } from "../logic/isBoxClientRect"
import { BOUNDING_CLIENT_RECT } from "../symbols"

/**
 *
 * @param target target check
 * @param box box check within/without side
 * @param cb function call if target `without` box
 * @param options { immediate?: boolean } whether to run immediately upon creation Useful for adding elements outside the screen and then moving them in
 * @returns callback stop watch
 * @description here is a simple function of `onCollide`
 */
export function onLeaveBox(
  target: Shape | Group,
  box: BoxClientRect,
  cb: () => void,
  options?: {
    immediate?: boolean
  }
) {
  // eslint-disable-next-line functional/no-let
  let inBoxed = true
  return watch(
    [target[BOUNDING_CLIENT_RECT], box[BOUNDING_CLIENT_RECT]],
    () => {
      if (!haveIntersection(target, box)) {
        if (inBoxed) {
          inBoxed = false
          cb()
        }
      } else {
        inBoxed = true
      }
    },
    options
  )
}
