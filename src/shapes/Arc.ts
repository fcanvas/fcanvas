import { AttrsDefault, EventsDefault, Shape } from "../Shape";
import { convertToRadial } from "../helpers/convertToRadial";
import { pointInCircle } from "../helpers/pointInCircle";

type Attrs<Events> = AttrsDefault<Events> & {
  // eslint-disable-next-line functional/prefer-readonly-type
  angle:
    | number
    | {
        // eslint-disable-next-line functional/prefer-readonly-type
        start: number;
        // eslint-disable-next-line functional/prefer-readonly-type
        end: number;
      };
  // eslint-disable-next-line functional/prefer-readonly-type
  innerRadius?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  outerRadius: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  clockwise?: boolean;
};

const HALF_PI = Math.PI / 2
export class Arc<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EventsCustom extends Record<string, any> & EventsDefault
> extends Shape<Attrs<EventsCustom>, EventsCustom> {
  static readonly type = "Arc";
  static readonly attrsReactSize = [
    "angle",
    "innerRadius",
    "outerRadius",
    "clockwise",
  ];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const angleStart = convertToRadial(
      typeof this.attrs.angle === "object" ? this.attrs.angle.start : 0
    );
    const angleEnd = convertToRadial(
      typeof this.attrs.angle === "object"
        ? this.attrs.angle.end
        : this.attrs.angle
    );

    const sinStart = Math.sin(angleStart + HALF_PI);
    const cosStart = Math.cos(angleStart + HALF_PI);

    const sinEnd = Math.sin(angleEnd + HALF_PI);
    const cosEnd = Math.cos(angleEnd + HALF_PI);

    context.moveTo(
      this.getInnerWidth() / 2 + sinStart * (this.attrs.innerRadius ?? 0),
      this.getInnerHeight() / 2 - cosStart * (this.attrs.innerRadius ?? 0)
    );
    context.lineTo(
      this.getInnerWidth() / 2 + sinStart * this.attrs.outerRadius,
      this.getInnerHeight() / 2 - cosStart * this.attrs.outerRadius
    );

    if (this.attrs.innerRadius !== void 0) {
      context.arc(
        this.getInnerWidth() / 2,
        this.getInnerHeight() / 2,
        this.attrs.innerRadius,
        angleStart,
        angleEnd,
        this.attrs.clockwise
      );
    }

    context.moveTo(
      this.getInnerWidth() / 2 + sinEnd * (this.attrs.innerRadius ?? 0),
      this.getInnerHeight() / 2 - cosEnd * this.attrs.outerRadius
    );
    context.lineTo(
      this.getInnerWidth() / 2 + sinEnd * (this.attrs.innerRadius ?? 0),
      this.getInnerHeight() / 2 - cosEnd * this.attrs.outerRadius
    );
  }

  constructor(attrs: Attrs<EventsCustom>) {
    super(attrs);
  }

  public getInnerWidth() {
    return (this.attrs.outerRadius ?? this.attrs.innerRadius) * 2;
  }
  public getInnerHeight() {
    return this.getInnerWidth();
  }

  public isPressedPoint(x: number, y: number) {
    const w_2 = this.getInnerWidth() / 2;
    const h_2 = this.getInnerHeight() / 2;
    const angle = Math.atan2(x + w_2 - this.attrs.x, y + h_2 - this.attrs.y);
    const inAngle =
      HALF_PI +
        convertToRadial(
          typeof this.attrs.angle === "object" ? this.attrs.angle.start : 0
        ) <=
        angle &&
      HALF_PI +
      convertToRadial(
          typeof this.attrs.angle === "object"
            ? this.attrs.angle.end
            : this.attrs.angle
        ) >=
        angle;

    if (!inAngle) return false;

    if (this.attrs.outerRadius !== void 0) {
      const inInnerBox = pointInCircle(
        x + w_2,
        y + h_2,
        this.attrs.x,
        this.attrs.y,
        this.attrs.outerRadius
      );
      const inOuterBox = pointInCircle(
        x + w_2,
        y + h_2,
        this.attrs.x,
        this.attrs.y,
        this.attrs.innerRadius ?? 0
      );

      return inInnerBox === false && inOuterBox;
    }

    return pointInCircle(
      x + w_2,
      y + h_2,
      this.attrs.x,
      this.attrs.y,
      this.attrs.innerRadius ?? 0
    );
  }
}
