import type { APIGroup } from "./apis/APIGroup"
import { getMousePos } from "./methods/getMousePos"
import { _setClientActivated } from "./useApi/useClientActivated"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AllLayer = APIGroup<any, Record<string, string>> & {
  isPressedPoint?: (x: number, y: number) => boolean
}

export const hookEvent = new Map<
  string,
  {
    name: string
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
        if (node.isPressedPoint!(client.x, client.y)) {
          _setClientActivated(client)
          return true
        }
      })
    ) {
      listeners.forEach((listener) => listener(event))
      _setClientActivated(null)
    }
  })
}
