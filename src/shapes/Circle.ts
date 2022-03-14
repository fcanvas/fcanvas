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
