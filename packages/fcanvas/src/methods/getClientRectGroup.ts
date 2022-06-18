import type { IChildrenAllowGroup } from "../Group"
import type AllShape from "../types/AllShape"
import type { ClientRectOptions } from "../types/ClientRectOptions"
import type { Offset } from "../types/Offset"
import type { Size } from "../types/Size"

export function getClientRectGroup<T extends IChildrenAllowGroup | AllShape>(
  shapes: T[] | Set<T>,
  config: ClientRectOptions | false = {}
): Offset & Size {
  // eslint-disable-next-line functional/no-let
  let x = Infinity
  // eslint-disable-next-line functional/no-let
  let y = Infinity
  /* width = 0,
    height = 0, */
  // eslint-disable-next-line functional/no-let
  let fillWidth = 0
  // eslint-disable-next-line functional/no-let
  let fillHeight = 0
  shapes.forEach((node) => {
    const clientRect: Offset & Size = config
      ? node.getClientRect(config)
      : node.getSelfRect?.() ?? {
          x: 0,
          y: 0,
          width: node.attrs.width,
          height: node.attrs.height
        }

    x = Math.min(x, clientRect.x + node.attrs.x)
    y = Math.min(y, clientRect.y + node.attrs.y)

    const sumWidth = clientRect.x + node.attrs.x + clientRect.width
    const sumHeight = clientRect.y + node.attrs.y + clientRect.height

    // fillWidth = Math.max(fillWidth, sumWidth);
    // fillHeight = Math.max(fillHeight, sumHeight);
    if (fillWidth < sumWidth) fillWidth = sumWidth
    // width = sumWidth//clientRect.width;

    if (fillHeight < sumHeight) fillHeight = sumHeight
    // height = sumHeight//clientRect.height;
  })

  return {
    x,
    y,
    width: fillWidth,
    height: fillHeight
  }
}
