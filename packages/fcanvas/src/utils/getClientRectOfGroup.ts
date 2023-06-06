import type { ComputedRef } from "@vue/reactivity"

import { BOUNCE_CLIENT_RECT } from "../symbols"
import type { GetClientRectOptions } from "../type/GetClientRectOptions"
import type { Offset } from "../type/Offset"
import type { Rect } from "../type/Rect"

// eslint-disable-next-line functional/no-mixed-type
export interface FakeShape {
  $: Partial<Offset> & {
    zIndex?: number
  }
  [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>
  // eslint-disable-next-line functional/no-method-signature
  getClientRect(config?: GetClientRectOptions): Rect
}

export function getClientRectGroup(
  children: Set<FakeShape>,
  config?: GetClientRectOptions
) {
  // eslint-disable-next-line one-var, functional/no-let
  let rX = 0,
    rY = 0,
    rWidth = 0,
    rHeight = 0

  children.forEach((node) => {
    const clientRect = config
      ? node.getClientRect(config)
      : node[BOUNCE_CLIENT_RECT].value
    const { x: attrX = 0, y: attrY = 0 } = node.$

    const x = clientRect.x + attrX
    const y = clientRect.y + attrY
    const width = clientRect.width + Math.abs(attrX)
    const height = clientRect.height + Math.abs(attrY)

    if (x < rX) rX = x
    if (y < rY) rY = y

    if (width > rWidth) rWidth = width
    if (height > rHeight) rHeight = height
  })

  return {
    x: rX,
    y: rY,
    width: rWidth,
    height: rHeight
  }
}
