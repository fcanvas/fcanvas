import { ref } from "@vue/reactivity"
import { addEvents } from "../helpers/addEvents"
import { Layer } from "../Layer"
import { CANVAS_ELEMENT } from "../symbols"

export function useMouseIsPressed(el: HTMLElement | Layer) {
  el = (el as Layer)[CANVAS_ELEMENT] ?? el
  const mouseIsPressed = ref(false)

  addEvents(el, ["mousedown", "touchstart"], (event) => {
    mouseIsPressed.value = true
  })
  addEvents(el, ["mouseup", "touchend"], () => {
    mouseIsPressed.value = false
  })

  return mouseIsPressed
}
