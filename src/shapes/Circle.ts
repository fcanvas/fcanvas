import { AttrsDefault, EventsDefault, Shape } from "../Shape";
import { TWO_PI } from "../constants/TWO_PI";
import { pointInCircle } from "../helpers/pointInCircle";

type Attrs<Events> = AttrsDefault<Events> & {
  // eslint-disable-next-line functional/prefer-readonly-type
  radius: number;
};

export class Circle<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EventsCustom extends Record<string, any> & EventsDefault
> extends Shape<Attrs<EventsCustom>, EventsCustom> {
  static readonly type = "Circle";
  static readonly attrsReactSize = ["radius"];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const center = this.getWidth() / 2;
    context.arc(center, center, this.attrs.radius, 0, TWO_PI);
  }
  constructor(attrs: Attrs<EventsCustom>) {
    super(attrs);
  }

  public getInnerWidth() {
    return this.attrs.radius * 2;
  }
  public getInnerHeight() {
    return this.attrs.radius * 2;
  }

  public isPressedPoint(x: number, y: number) {
    const center = this.getWidth() / 2;
    return pointInCircle(
      x,
      y,
      this.attrs.x + center,
      this.attrs.y + center,
      this.attrs.radius
    );
  }
}
