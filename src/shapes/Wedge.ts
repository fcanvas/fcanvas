import { Shape } from "../Shape";
import { convertToDegress } from "../helpers/convertToDegress";
import { pointInCircle } from "../helpers/pointInCircle";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  angle: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  radius: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  clockwise?: boolean;
};

export class Wedge<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {}
> extends Shape<AttrsCustom, EventsCustom> {
  static readonly type = "Wedge";
  static readonly attrsReactSize = ["radius"];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(
      0,
      0,
      this.attrs.radius,
      0,
      convertToDegress(this.attrs.angle),
      this.attrs.clockwise
    );
    context.lineTo(0, 0);
    this.fillStrokeScene(context);
  }

  protected size() {
    return {
      width: this.attrs.radius * 2,
      height: this.attrs.radius * 2,
    };
  }

  public isPressedPoint(x: number, y: number) {
    return pointInCircle(
      x,
      y,
      this.attrs.x,
      this.attrs.y,
      this.attrs.radius + this.getHitStroke()
    );
  }
}
