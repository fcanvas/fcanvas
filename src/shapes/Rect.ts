import { AttrsDefault, Shape } from "../Shape";
import { pointInBox } from "../helpers/pointInBox";

type Attrs = AttrsDefault & {
  // eslint-disable-next-line functional/prefer-readonly-type
  width: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height: number;
};

export class Rect extends Shape<Attrs> {
  static readonly type = "Rect";

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.rect(0, 0, this.attrs.width, this.attrs.height);
  }
  constructor(attrs: Attrs) {
    super(attrs);
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
