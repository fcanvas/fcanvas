import type { Layer } from "./Layer"
import type { Stage } from "./Stage"
import type { APIGroup } from "./apis/APIGroup"
import { getMousePos } from "./fns/getMousePos"
import type { MapListeners } from "./logic/getListenersAll"
import { CANVAS_ELEMENT, LOCALS } from "./symbols"

function isEventInComponent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: Stage | APIGroup<any, any>,
  canvas: undefined | HTMLCanvasElement | OffscreenCanvas,
  mousePos: ReturnType<typeof getMousePos>,
  event: Event
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(node as unknown as any).isPressedPoint) return true
  if (
    mousePos.some((client) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as unknown as any).isPressedPoint(client.x, client.y)
    )
  )
    return true

  return (
    event.type === "touchend" &&
    ((event as TouchEvent).touches.length === 0 ||
      getMousePos(
        event as MouseEvent | TouchEvent,
        canvas,
        (node as Layer).uid,
        Infinity,
        true
      ).every(
        (client) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          !(node as unknown as any).isPressedPoint(client.x, client.y)
      ))
  )
}

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
    const mousePos = getMousePos(
      event as MouseEvent | TouchEvent,
      canvas,
      (node as Layer).uid
    )

    listeners.forEach((listeners, node) => {
      if (isEventInComponent(node, canvas, mousePos, event))
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
      const mousePos = getMousePos(
        event as MouseEvent | TouchEvent,
        canvas,
        (node as Layer).uid
      )

      listeners.forEach((listeners, node) => {
        if (isEventInComponent(node, canvas, mousePos, event)) {
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
