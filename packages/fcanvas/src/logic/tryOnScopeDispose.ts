import { getCurrentShape } from "../currentShape"

export function tryOnScopeDispose(fn: () => void) {
  const shape = getCurrentShape(true)

  if (shape) shape.on("destroy", fn)
}
