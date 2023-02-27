import { reactive } from "@vue/reactivity"

import type { Layer } from "../Layer"
import { getCurrentShape } from "../currentShape"
import { getMousePos } from "../fns/getMousePos"
import type { ElAddEventListener } from "../helpers/addEvents"
import { addEvents } from "../helpers/addEvents"
import { tryOnScopeDispose } from "../logic/tryOnScopeDispose"

const mousePosMap = new WeakMap<
  object,
  {
    mouseX: number
    mouseY: number
    winMouseX: number
    winMouseY: number
    isTouch: boolean
  }
>()
export function useMousePos(instance: ElAddEventListener = getCurrentShape()) {
  const onStore = mousePosMap.get(instance)
  if (onStore) return onStore

  const mousePos = reactive({
    mouseX: 0,
    mouseY: 0,
    winMouseX: 0,
    winMouseY: 0,
    isTouch: false
  })
  // warning
  const stop = addEvents(
    instance,
    ["mousedown", "mousemove", "touchstart", "touchmove"],
    (event) => {
      // is touch

      mousePos.isTouch = event.type.startsWith("touch")
      // get offset
      const { x, y, winX, winY } = getMousePos(
        event as TouchEvent | MouseEvent,
        undefined,
        (instance as Layer).uid,
        1
      )[0]

      mousePos.mouseX = x

      mousePos.mouseY = y

      mousePos.winMouseX = winX

      mousePos.winMouseY = winY
    }
  )

  mousePosMap.set(instance, mousePos)

  tryOnScopeDispose(() => {
    mousePosMap.delete(instance)

    stop()
  })

  return mousePos
}
