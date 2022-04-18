import { Shape } from "../Shape";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  numPoints: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  innerRadius: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  outerRadius: number;
};

export class Star<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<AttrsCustom, EventsCustom, AttrsRefs, AttrsRaws> {
  static readonly type = "Star";
  static readonly sizes = ["innerRadius", "outerRadius"];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const { innerRadius, outerRadius, numPoints } = this.attrs;

    context.moveTo(0, 0 - outerRadius);

    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let n = 1; n < numPoints * 2; n++) {
      const radius = n % 2 === 0 ? outerRadius : innerRadius;
      const x = radius * Math.sin((n * Math.PI) / numPoints);
      const y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
      context.lineTo(x, y);
    }

    this.fillStrokeScene(context);
  }
  protected size() {
    return {
      width: this.attrs.outerRadius * 2,
      height: this.attrs.outerRadius * 2,
    };
  }
}