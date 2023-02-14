import { getCurrentScope, onScopeDispose } from "@vue/reactivity"

import { getCurrentShape } from "../currentShape"

export function tryOnScopeDispose(fn: () => void) {
  const shape = getCurrentShape(true)
  const scope = getCurrentScope()

  if (scope) onScopeDispose(fn)
  if (shape) shape.on("destroy", fn)
}
