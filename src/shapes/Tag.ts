import { Group } from "../Group";
import { Layer } from "../Layer";
import { Shape } from "../Shape";

import { Label } from "./Label";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  pointerDirection?: "up" | "down" | "left" | "right" | "none";
  // eslint-disable-next-line functional/prefer-readonly-type
  pointerWidth?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  pointerHeight?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  cornerRadius?: number | number[];
  // eslint-disable-next-line functional/prefer-readonly-type
  width?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height?: number;
};

export class Tag<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<
  AttrsCustom,
  EventsCustom,
  AttrsRefs,
  AttrsRaws,
  Layer | Group | Label
> {
  static readonly type = "Tag";
  static readonly sizes = [
    "pointerDirection",
    "pointerWidth",
    "pointerHeight",
    "width",
    "height",
  ];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const width = this.attrs.width ?? 0,
      height = this.attrs.height ?? 0,
      pointerDirection = this.attrs.pointerDirection,
      { pointerWidth = 20, pointerHeight = 20, cornerRadius } = this.attrs;

    // eslint-disable-next-line functional/no-let
    let topLeft = 0,
      topRight = 0,
      bottomRight = 0,
      bottomLeft = 0;
    const ws2 = (this.attrs.width ?? 0) / 2;
    const hs2 = (this.attrs.height ?? 0) / 2;
    if (typeof cornerRadius === "number") {
      topLeft = Math.min(cornerRadius, ws2, hs2);
      topRight = topLeft;
      bottomRight = topLeft;
      bottomLeft = topLeft;
      // eslint-disable-next-line functional/prefer-readonly-type
    } else if ((cornerRadius as number[]).length === 2) {
      // eslint-disable-next-line functional/prefer-readonly-type
      topLeft = Math.min((cornerRadius as number[])[0], ws2, hs2);
      bottomRight = topLeft;
      // eslint-disable-next-line functional/prefer-readonly-type
      topRight = Math.min((cornerRadius as number[])[1], ws2, hs2);
      bottomLeft = topRight;
    } else {
      [topLeft, topRight, bottomRight, bottomLeft] = [
        // eslint-disable-next-line functional/prefer-readonly-type
        Math.min((cornerRadius as number[])[0], ws2, hs2),
        // eslint-disable-next-line functional/prefer-readonly-type
        Math.min((cornerRadius as number[])[1], ws2, hs2),
        // eslint-disable-next-line functional/prefer-readonly-type
        Math.min((cornerRadius as number[])[2], ws2, hs2),
        // eslint-disable-next-line functional/prefer-readonly-type
        Math.min((cornerRadius as number[])[3], ws2, hs2),
      ];
    }

    context.moveTo(topLeft, 0);

    if (pointerDirection === "up") {
      context.lineTo((width - pointerWidth) / 2, 0);
      context.lineTo(width / 2, -1 * pointerHeight);
      context.lineTo((width + pointerWidth) / 2, 0);
    }

    context.lineTo(width - topRight, 0);
    context.arc(
      width - topRight,
      topRight,
      topRight,
      (Math.PI * 3) / 2,
      0,
      false
    );

    if (pointerDirection === "right") {
      context.lineTo(width, (height - pointerHeight) / 2);
      context.lineTo(width + pointerWidth, height / 2);
      context.lineTo(width, (height + pointerHeight) / 2);
    }

    context.lineTo(width, height - bottomRight);
    context.arc(
      width - bottomRight,
      height - bottomRight,
      bottomRight,
      0,
      Math.PI / 2,
      false
    );

    if (pointerDirection === "down") {
      context.lineTo((width + pointerWidth) / 2, height);
      context.lineTo(width / 2, height + pointerHeight);
      context.lineTo((width - pointerWidth) / 2, height);
    }

    context.lineTo(bottomLeft, height);
    context.arc(
      bottomLeft,
      height - bottomLeft,
      bottomLeft,
      Math.PI / 2,
      Math.PI,
      false
    );

    if (pointerDirection === "left") {
      context.lineTo(0, (height + pointerHeight) / 2);
      context.lineTo(-1 * pointerWidth, height / 2);
      context.lineTo(0, (height - pointerHeight) / 2);
    }

    context.lineTo(0, topLeft);
    context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);

    this.fillStrokeScene(context);
  }
  public getSelfRect() {
    // eslint-disable-next-line functional/no-let
    let x = 0,
      y = 0,
      width = this.attrs.width ?? 0,
      height = this.attrs.height ?? 0;
    const {
      pointerWidth = 20,
      pointerHeight = 20,
      pointerDirection: direction,
    } = this.attrs;

    switch (direction) {
      case "up":
        y -= pointerHeight;
        height += pointerHeight;
        break;
      case "down":
        height += pointerHeight;
        break;
      case "left":
        // ARGH!!! I have no idea why should I used magic 1.5!!!!!!!!!
        x -= pointerWidth * 1.5;
        width += pointerWidth;
        break;
      case "right":
        width += pointerWidth * 1.5;
        break;
    }
    return {
      x: x,
      y: y,
      width: width,
      height: height,
    };
  }
}
