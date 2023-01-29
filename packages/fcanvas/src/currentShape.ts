import type { Group } from "./Group"
import type { Shape } from "./Shape"
import { isDev } from "./env"

// eslint-disable-next-line functional/no-let, @typescript-eslint/no-explicit-any
let currentShape: Shape | Group<any> | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _setCurrentShape(instance: Shape | Group<any> | null) {
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
