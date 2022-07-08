import { ref } from "@vue/reactivity"

import type { Layer } from "../Layer"
import { addEvents } from "../helpers/addEvents"
import { CANVAS_ELEMENT } from "../symbols"

export function useMouseIsPressed(el: HTMLElement | Layer) {
  el = (el as Layer)[CANVAS_ELEMENT] ?? el
  const mouseIsPressed = ref(false)

  addEvents(el, ["mousedown", "touchstart"], () => {
    // eslint-disable-next-line functional/immutable-data
    mouseIsPressed.value = true
  })
  addEvents(el, ["mouseup", "touchend"], () => {
    // eslint-disable-next-line functional/immutable-data
    mouseIsPressed.value = false
  })

  return mouseIsPressed
}
