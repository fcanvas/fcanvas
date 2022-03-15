import { Shape } from "../Shape";
import { pointInBox } from "../helpers/pointInBox";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  width: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export class Rect<EventsCustom extends Record<string, any> = {}> extends Shape<
  AttrsCustom,
  EventsCustom
> {
  static readonly type = "Rect";

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.rect(0, 0, this.attrs.width, this.attrs.height);
  }

  public isPressedPoint(x: number, y: number) {
    return pointInBox(
      x,
      y,
      this.attrs.x,
      this.attrs.y,
      this.attrs.width,
      this.attrs.height
    );
  }
}
