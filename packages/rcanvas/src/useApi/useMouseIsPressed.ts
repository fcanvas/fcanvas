import { ref } from "@vue/reactivity"

import type { Layer } from "../Layer"
import { getCurrentShape } from "../currentShape"
import type { ElAddEventListener } from "../helpers/addEvents"
import { addEvents } from "../helpers/addEvents"
import { CANVAS_ELEMENT } from "../symbols"

const mouseIsPressedMap = new WeakMap()
export function useMouseIsPressed(
  instance: ElAddEventListener = getCurrentShape()
) {
  instance = (instance as Layer)[CANVAS_ELEMENT] ?? instance

  const onStore = mouseIsPressedMap.get(instance)

  if (onStore) return onStore

  const mouseIsPressed = ref(false)

  addEvents(instance, ["mousedown", "touchstart"], () => {
    // eslint-disable-next-line functional/immutable-data
    mouseIsPressed.value = true
  })
  addEvents(instance, ["mouseup", "touchend"], () => {
    // eslint-disable-next-line functional/immutable-data
    mouseIsPressed.value = false
  })

  mouseIsPressedMap.set(instance, mouseIsPressed)

  return mouseIsPressed
}
