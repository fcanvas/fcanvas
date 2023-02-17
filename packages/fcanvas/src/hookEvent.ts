import type { APIGroup } from "./apis/APIGroup"
import { getMousePos } from "./fns/getMousePos"
import { LOCALS } from "./symbols"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AllLayer = APIGroup<any, Record<string, string>> & {
  isPressedPoint?: (x: number, y: number) => boolean
}

export const hookEvent = new Map<
  string,
  {
    name: string[]
    handle: typeof handleCustomEventDefault
  }
>()
export function handleCustomEventDefault(
  listenersGroup: Map<AllLayer, Set<(event: Event) => void>>,
  event: Event,
  canvas: HTMLCanvasElement
) {
  // eslint-disable-next-line functional/no-let
  let mousePos: ReturnType<typeof getMousePos>
  listenersGroup.forEach((listeners, node) => {
    if (!mousePos)
      mousePos = getMousePos(event as MouseEvent | TouchEvent, canvas)

    if (
      !mousePos ||
      !node.isPressedPoint ||
      // eslint-disable-next-line array-callback-return
      mousePos.some((client) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (node.isPressedPoint!(client.x, client.y)) return true
      })
    )
      listeners.forEach((listener) => listener(event))
  })
}

function createHandleMouseHover(isOver: boolean) {
  return (
    listenersGroup: Map<AllLayer, Set<(event: Event) => void>>,
    event: Event,
    canvas: HTMLCanvasElement
  ) => {
    // eslint-disable-next-line functional/no-let
    let mousePos: ReturnType<typeof getMousePos>
    listenersGroup.forEach((listeners, node) => {
      if (!mousePos)
        mousePos = getMousePos(event as MouseEvent | TouchEvent, canvas)

      if (
        !mousePos ||
        !node.isPressedPoint ||
        // eslint-disable-next-line array-callback-return
        mousePos.some((client) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          node.isPressedPoint!(client.x, client.y)
        })
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
