import { AttrsDefault, Shape } from "../Shape";
import { TWO_PI } from "../constants/TWO_PI";
import { pointInCircle } from "../helpers/pointInCircle";

type Attrs = AttrsDefault & {
  // eslint-disable-next-line functional/prefer-readonly-type
  radius: number;
};

export class Circle extends Shape<Attrs> {
  readonly type = "Circle";
  protected readonly attrsReactSize = ["radius"];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const center = this.getWidth() / 2;
    context.arc(center, center, this.attrs.radius, 0, TWO_PI);
  }
  constructor(attrs: Attrs) {
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
