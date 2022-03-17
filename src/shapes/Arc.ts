import { Shape } from "../Shape";
import { convertToRadial } from "../helpers/convertToRadial";
import { pointInCircle } from "../helpers/pointInCircle";

type AttrsCustom = {
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

const HALF_PI = Math.PI / 2;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export class Arc<EventsCustom extends Record<string, any> = {}> extends Shape<
  AttrsCustom,
  EventsCustom
> {
  static readonly type = "Arc";
  static readonly attrsReactSize = [
    "angle",
    "innerRadius",
    "outerRadius",
    "clockwise",
  ];
  public readonly _centroid = true;

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
      sinStart * (this.attrs.innerRadius ?? 0),
      cosStart * (this.attrs.innerRadius ?? 0)
    );
    context.lineTo(
      sinStart * this.attrs.outerRadius,
      cosStart * this.attrs.outerRadius
    );

    if (this.attrs.innerRadius !== void 0) {
      context.arc(
        0,
        0,
        this.attrs.innerRadius,
        angleStart,
        angleEnd,
        this.attrs.clockwise
      );
    }

    context.moveTo(
      sinEnd * (this.attrs.innerRadius ?? 0),
      -cosEnd * this.attrs.outerRadius
    );
    context.lineTo(
      +sinEnd * (this.attrs.innerRadius ?? 0),
      -cosEnd * this.attrs.outerRadius
    );

    this.fillStrokeScene(context);
  }

  protected size() {
    return {
      width: this.attrs.outerRadius * 2,
      height: this.attrs.outerRadius * 2,
    };
  }

  public isPressedPoint(x: number, y: number) {
    const angle = Math.atan2(x - this.attrs.x, y - this.attrs.y);
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
        x,
        y,
        this.attrs.x,
        this.attrs.y,
        this.attrs.outerRadius
      );
      const inOuterBox = pointInCircle(
        x,
        y,
        this.attrs.x,
        this.attrs.y,
        this.attrs.innerRadius ?? 0
      );

      return inInnerBox === false && inOuterBox;
    }

    return pointInCircle(
      x,
      y,
      this.attrs.x,
      this.attrs.y,
      this.attrs.innerRadius ?? 0
    );
  }
}
