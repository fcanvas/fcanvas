import { Shape } from "../Shape";
import { convertToRadial } from "../helpers/convertToRadial";
import { pointInCircle } from "../helpers/pointInCircle";

export type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  angle: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  innerRadius: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  outerRadius: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  clockwise?: boolean;
};

export class Arc<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsCustomMore extends Record<string, unknown> &
    Omit<AttrsCustom, "angle"> = AttrsCustom
> extends Shape<AttrsCustomMore, EventsCustom> {
  static readonly type: string = "Arc";
  // eslint-disable-next-line functional/prefer-readonly-type
  static readonly attrsReactSize: string[] = [
    "angle",
    "innerRadius",
    "outerRadius",
    "clockwise",
  ];
  public readonly _centroid = true;

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const angle = convertToRadial((this.attrs.angle as number) ?? 360);

    context.arc(0, 0, this.attrs.outerRadius, 0, angle, this.attrs.clockwise);
    context.arc(0, 0, this.attrs.innerRadius, angle, 0, !this.attrs.clockwise);

    this.fillStrokeScene(context);
  }

  protected size() {
    return {
      width: this.attrs.outerRadius * 2,
      height: this.attrs.outerRadius * 2,
    };
  }

  public isPressedPoint(x: number, y: number) {
    return (
      !pointInCircle(
        x,
        y,
        this.attrs.x,
        this.attrs.y,
        this.attrs.innerRadius
      ) &&
      pointInCircle(
        x,
        y,
        this.attrs.x,
        this.attrs.y,
        this.attrs.outerRadius + this.getHitStroke()
      )
    );
  }
}
