import { reactive, ref } from "@vue/reactivity"
import { addEvents } from "../helpers/addEvents"
import { Layer } from "../Layer"
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
      mousePos.isTouch = event.type.startsWith("touch")
      // get offset
      const { x, y, winX, winY } = getMousePos(
        el as HTMLElement,
        event as TouchEvent | MouseEvent,
        1
      )[0]

      mousePos.mouseX = x
      mousePos.mouseY = y

      mousePos.winMouseX = winX
      mousePos.winMouseY = winY
    }
  )

  return mousePos
}
