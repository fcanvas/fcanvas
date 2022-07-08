import { reactive } from "@vue/reactivity"

import type { Layer } from "../Layer"
import { addEvents } from "../helpers/addEvents"
import { getMousePos } from "../methods/getMousePos"
import { CANVAS_ELEMENT } from "../symbols"

export function useMousePos(el: HTMLElement | Layer) {
  el = (el as Layer)[CANVAS_ELEMENT] ?? el
  const mousePos = reactive({
    mouseX: 0,
    mouseY: 0,
    winMouseX: 0,
    winMouseY: 0,
    isTouch: false
  })

  addEvents(
    el,
    ["mousedown", "mousemove", "touchstart", "touchmove"],
    (event) => {
      // is touch
      // eslint-disable-next-line functional/immutable-data
      mousePos.isTouch = event.type.startsWith("touch")
      // get offset
      const { x, y, winX, winY } = getMousePos(
        el as HTMLElement,
        event as TouchEvent | MouseEvent,
        1
      )[0]

      // eslint-disable-next-line functional/immutable-data
      mousePos.mouseX = x
      // eslint-disable-next-line functional/immutable-data
      mousePos.mouseY = y

      // eslint-disable-next-line functional/immutable-data
      mousePos.winMouseX = winX
      // eslint-disable-next-line functional/immutable-data
      mousePos.winMouseY = winY
    }
  )

  return mousePos
}
