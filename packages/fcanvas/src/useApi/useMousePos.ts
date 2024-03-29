import { reactive } from "@vue/reactivity"

import type { Layer } from "../Layer"
import { getCurrentShape } from "../currentShape"
import { getMousePos } from "../fns/getMousePos"
import type { ElAddEventListener } from "../helpers/addEvents"
import { addEvents } from "../helpers/addEvents"
import { tryOnScopeDispose } from "../logic/tryOnScopeDispose"

import { CANVAS_ELEMENT } from "./../symbols"

const mousePosMap = new WeakMap<
  object,
  {
    mouseX: number
    mouseY: number
    winMouseX: number
    winMouseY: number
    isTouch: boolean
    id: number
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
    isTouch: false,
    id: -1
  })
  // warning
  const stop = addEvents(
    instance,
    ["mousedown", "mousemove", "touchstart", "touchmove"],
    (event) => {
      // is touch

      mousePos.isTouch = event.type.startsWith("touch")
      // get offset
      const { x, y, winX, winY, id } = getMousePos(
        event as TouchEvent | MouseEvent,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (instance as unknown as any)[CANVAS_ELEMENT],
        (instance as Layer).uid,
        1
      )[0]

      mousePos.mouseX = x
      mousePos.mouseY = y
      mousePos.winMouseX = winX
      mousePos.winMouseY = winY
      mousePos.id = id
    }
  )

  mousePosMap.set(instance, mousePos)

  tryOnScopeDispose(() => {
    mousePosMap.delete(instance)

    stop()
  })

  return mousePos
}
