import { Shape } from "../Shape";
import { pointInCircle } from "../helpers/pointInCircle";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  radius: number;
};

export class Circle<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<AttrsCustom, EventsCustom, AttrsRefs, AttrsRaws> {
  static readonly type = "Circle";
  static readonly sizes = ["radius"];
  public readonly _centroid = true;

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(0, 0, this.attrs.radius, 0, Math.PI * 2);
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
