import type { getMousePos } from "../methods/getMousePos"

let mousePos: ReturnType<typeof getMousePos> | null

export function _setMousePos(client: ReturnType<typeof getMousePos> | null) {
  mousePos = client
}

export function useMousePos(): ReturnType<typeof getMousePos> {
  if (!mousePos) {
    console.warn("[useMousePos]: call this function on stack event handler.")
  }

  return mousePos!
}
