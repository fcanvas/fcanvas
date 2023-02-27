import type { Layer } from "./Layer"
import type { Stage } from "./Stage"
import { getMousePos } from "./fns/getMousePos"
import type { MapListeners } from "./logic/getListenersAll"
import { CANVAS_ELEMENT, LOCALS } from "./symbols"

export const hookEvent = new Map<
  string,
  {
    name: string[]
    handle: typeof handleCustomEventDefault
  }
>()
export function handleCustomEventDefault(
  all: MapListeners,
  nameEvent: string,
  event: Event,
  targetListen: Stage
) {
  // eslint-disable-next-line functional/no-let
  let everyEventOnChildren = true
  all.get(nameEvent)?.forEach((listeners, node) => {
    if (node === targetListen && everyEventOnChildren)
      everyEventOnChildren = false

    const canvas = (node as Layer)[CANVAS_ELEMENT] as
      | HTMLCanvasElement
      | undefined
    const mousePos = getMousePos(event as MouseEvent | TouchEvent, canvas, (node as Layer).uid)

    listeners.forEach((listeners, node) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !(node as unknown as any).isPressedPoint ||
        mousePos.some((client) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (node as unknown as any).isPressedPoint(client.x, client.y)
        )
      )
        listeners.forEach((cb) => cb(event))
    })
  })
  if (everyEventOnChildren) event.preventDefault()
}

function createHandleMouseHover(
  isOver: boolean
): typeof handleCustomEventDefault {
  return (all, nameEvent, event, targetListen) => {
    // eslint-disable-next-line functional/no-let
    let everyEventOnChildren = true
    all.get(nameEvent)?.forEach((listeners, node) => {
      if (node === targetListen && everyEventOnChildren)
        everyEventOnChildren = false

      const canvas = (node as Layer)[CANVAS_ELEMENT] as
        | HTMLCanvasElement
        | undefined
      const mousePos = getMousePos(event as MouseEvent | TouchEvent, canvas, (node as Layer).uid)

      listeners.forEach((listeners, node) => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          !(node as unknown as any).isPressedPoint ||
          mousePos.some((client) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (node as unknown as any).isPressedPoint(client.x, client.y)
          )
        ) {
          if (isOver) {
            if (!node[LOCALS].hover) {
              node[LOCALS].hover = true
              listeners.forEach((listener) => listener(event))
            }
          }
        } else if (!isOver) {
          if (node[LOCALS].hover) {
            node[LOCALS].hover = false

            listeners.forEach((listener) => listener(event))
          }
        }
      })
    })
    if (everyEventOnChildren) event.preventDefault()
  }
}
hookEvent.set("mouseover", {
  name: ["touchmove", "mousemove"],
  handle: createHandleMouseHover(true)
})
hookEvent.set("mouseout", {
  name: ["touchmove", "mousemove"],
  handle: createHandleMouseHover(false)
})
