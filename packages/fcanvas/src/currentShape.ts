import type { Group } from "./Group"
import type { Shape } from "./Shape"
import { isDev } from "./env"

// eslint-disable-next-line functional/no-let, @typescript-eslint/no-explicit-any
let currentShape: Shape | Group<any> | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _setCurrentShape(instance: Shape | Group<any> | null) {
  currentShape = instance
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCurrentShape(noWarn?: boolean): Shape | Group<any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-redeclare
export function getCurrentShape(noWarn: true): Shape | Group<any> | null
// eslint-disable-next-line no-redeclare
export function getCurrentShape(noWarn?: boolean) {
  if (!currentShape && !noWarn) {
    if (isDev) {
      console.warn(
        "[getCurrentShape]: call this function on stack setup Shape."
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return currentShape!
}
