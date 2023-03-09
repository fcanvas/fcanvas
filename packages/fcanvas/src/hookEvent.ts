/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Layer } from "./Layer"
import type { Stage } from "./Stage"
import type { APIGroup } from "./apis/APIGroup"
import { getMousePos } from "./fns/getMousePos"
import type { MapListeners } from "./logic/getListenersAll"
import { CANVAS_ELEMENT } from "./symbols"

function isEventInComponent(
  node: Stage | APIGroup<any, any>,
  canvas: undefined | HTMLCanvasElement | OffscreenCanvas,
  mousePos: ReturnType<typeof getMousePos>,
  event: Event
) {
  if (!(node as unknown as any).isPressedPoint) return true
  if (
    mousePos.some((client) =>
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
        (client) => !(node as unknown as any).isPressedPoint(client.x, client.y)
      ))
  )
}

export const hookEvent = new Map<
  string,
  {
    name: string[]
    handle: ReturnType<typeof createHandle>
  }
>()

function createHandle(
  fn: (
    node: Stage | APIGroup<any, any>,
    canvas: undefined | HTMLCanvasElement | OffscreenCanvas,
    mousePos: ReturnType<typeof getMousePos>,
    event: Event,
    listeners: Set<(event: Event) => void>
  ) => void
) {
  return (
    all: MapListeners,
    nameEvent: string,
    event: Event,
    targetListen: Stage
  ) => {
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
        fn(node, canvas, mousePos, event, listeners)
      })
    })
    if (everyEventOnChildren) event.preventDefault()
  }
}
export const handleCustomEventDefault = createHandle(
  (node, canvas, mousePos, event, listeners) => {
    if (isEventInComponent(node, canvas, mousePos, event))
      listeners.forEach((cb) => cb(event))
  }
)

function createHandleMouseHover(
  isOver: boolean
): typeof handleCustomEventDefault {
  return createHandle((node, canvas, mousePos, event, listeners) => {
    if (isEventInComponent(node, canvas, mousePos, event)) {
      if (isOver) {
        if ((node as unknown as any).__isOutside) {
          ;(node as unknown as any).__isOutside = false
          listeners.forEach((listener) => listener(event))
        }
      }
    } else if (!isOver) {
      if (!(node as unknown as any).__isOutside) {
        ;(node as unknown as any).__isOutside = true

        listeners.forEach((listener) => listener(event))
      }
    }
  })
}

const hookEnter = {
  name: ["mousemove"],
  handle: createHandleMouseHover(true)
}
const hookLeave = {
  name: ["mousemove"],
  handle: createHandleMouseHover(false)
}
hookEvent.set("mouseover", hookEnter)
hookEvent.set("mouseenter", hookEnter)
hookEvent.set("mouseout", hookLeave)
hookEvent.set("mouseleave", hookLeave)
