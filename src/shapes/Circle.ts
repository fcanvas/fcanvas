import { Shape } from "../Shape";
import { pointInCircle } from "../helpers/pointInCircle";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  radius: number;
};

const TWO_PI = Math.PI * 2;
export class Circle<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {}
> extends Shape<AttrsCustom, EventsCustom> {
  static readonly type = "Circle";
  static readonly attrsReactSize = ["radius"];
  public readonly _centroid = true;

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(0, 0, this.attrs.radius, 0, TWO_PI);
  }

  public size() {
    return {
      width: this.attrs.radius * 2,
      height: this.attrs.radius * 2,
    };
  }

  public isPressedPoint(x: number, y: number) {
    return pointInCircle(x, y, this.attrs.x, this.attrs.y, this.attrs.radius);
  }
}
