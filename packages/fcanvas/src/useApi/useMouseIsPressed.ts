import type { Ref } from "@vue/reactivity"
import { ref } from "@vue/reactivity"

import { getCurrentShape } from "../currentShape"
import type { ElAddEventListener } from "../helpers/addEvents"
import { addEvents } from "../helpers/addEvents"
import { tryOnScopeDispose } from "../logic/tryOnScopeDispose"

const mouseIsPressedMap = new WeakMap<object, Ref<boolean>>()
export function useMouseIsPressed(
  instance: ElAddEventListener = getCurrentShape()
) {
  const onStore = mouseIsPressedMap.get(instance)

  if (onStore) return onStore

  const mouseIsPressed = ref(false)

  const cancelDown = addEvents(instance, ["mousedown", "touchstart"], () => {
    mouseIsPressed.value = true
  })
  const cancelUp = addEvents(instance, ["mouseup", "mouseleave", "touchend", "touchcancel"], () => {
    mouseIsPressed.value = false
  })

  mouseIsPressedMap.set(instance, mouseIsPressed)

  tryOnScopeDispose(() => {
    mouseIsPressedMap.delete(instance)

    cancelDown()
    cancelUp()
  })

  return mouseIsPressed
}
