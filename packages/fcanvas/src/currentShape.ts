import type { Shape } from "./Shape"
import { isDev } from "./env"

// eslint-disable-next-line functional/no-let
let currentShape: Shape | null

export function _setCurrentShape(instance: Shape | null) {
  currentShape = instance
}
export function getCurrentShape() {
  if (!currentShape) {
    if (isDev) {
      console.warn(
        "[getCurrentShape]: call this function on stack setup Shape."
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return currentShape!
}
