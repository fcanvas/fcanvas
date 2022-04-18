import { ClientRectOptions } from "../types/ClientRectOptions";
import { Shape } from "../Shape";
import { Offset } from "../types/Offset";
import { Size } from "../types/Size";

export function getClientRect<T extends Shape<any, any> | (Offset & Size)>(
  shapes: T[] | Set<T>,
  config: ClientRectOptions | false = false
) {
  // eslint-disable-next-line functional/no-let
  let x = Infinity,
    y = -Infinity,
    width = 0,
    height = 0,
    fillWidth = 0,
    fillHeight = 0;
  shapes.forEach((node) => {
    const clientRect = config
      ? node.getClientRect(config)
      : node.getSelfRect() ?? node;

    x = Math.min(x, clientRect.x + node.attrs.x);
    y = Math.max(y, clientRect.y + node.attrs.y);

    const sumWidth = clientRect.x + clientRect.width;
    const sumHeight = clientRect.y + clientRect.height;

    fillWidth = Math.max(fillWidth, sumWidth);
    fillHeight = Math.max(fillHeight, sumHeight);
    if (fillWidth === sumWidth) {
      width = clientRect.width;
    }
    if (fillHeight === sumHeight) {
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
