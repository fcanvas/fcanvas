import { ClientRectOptions } from "../types/ClientRectOptions";
import { Shape } from "../Shape";
import { Offset } from "../types/Offset";
import { Size } from "../types/Size";

export function getClientRectGroup<T extends Shape<any, any>>(
  shapes: T[] | Set<T>,
  config: ClientRectOptions | false = {}
): Offset & Size {
  // eslint-disable-next-line functional/no-let
  let x = Infinity,
    y = Infinity,
    width = 0,
    height = 0,
    fillWidth = 0,
    fillHeight = 0;
  shapes.forEach((node) => {
    const clientRect: Offset & Size = config
      ? node.getClientRect(config)
      : node.getSelfRect?.() ?? {
        x: 0,
        y: 0,
        width: clientRect.attrs.width,
        height: clientRect.attrs.height
      };

    x = Math.min(x, clientRect.x + node.attrs.x);
    y = Math.min(y, clientRect.y + node.attrs.y);

    const sumWidth = clientRect.x + clientRect.width;
    const sumHeight = clientRect.y + clientRect.height;

    // fillWidth = Math.max(fillWidth, sumWidth);
    // fillHeight = Math.max(fillHeight, sumHeight);
    if (fillWidth < sumWidth) {
      fillWidth = sumHeight;
      width = clientRect.width;
    }
    if (fillHeight < sumHeight) {
      fillHeight = sumHeight;
      height = clientRect.height;
    }
  });

  return {
    x,
    y,
    width,
    height,
  };
}
