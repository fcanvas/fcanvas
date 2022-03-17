import { Shape } from "../Shape";
import { pointInPolygon } from "../helpers/pointInPolygon";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  sides: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  radius: number;
};

export class RegularPolygon<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {}
> extends Shape<AttrsCustom, EventsCustom> {
  static readonly type = "RegularPolygon";
  static readonly attrsReactSize = ["sides", "radius"];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const points = this.getPoints();

    context.moveTo(points[0].x, points[0].y);

    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let n = 1; n < points.length; n++) {
      context.lineTo(points[n].x, points[n].y);
    }

    this.fillStrokeScene(context);
  }
  private getPoints() {
    const { sides, radius } = this.attrs;
    const points = [];
    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let n = 0; n < sides; n++) {
      // eslint-disable-next-line functional/immutable-data
      points.push({
        x: radius * Math.sin((n * 2 * Math.PI) / sides),
        y: -1 * radius * Math.cos((n * 2 * Math.PI) / sides),
      });
    }
    return points;
  }
  public getSelfRect() {
    const points = this.getPoints();

    // eslint-disable-next-line functional/no-let
    let minX = points[0].x;
    // eslint-disable-next-line functional/no-let
    let maxX = points[0].y;
    // eslint-disable-next-line functional/no-let
    let minY = points[0].x;
    // eslint-disable-next-line functional/no-let
    let maxY = points[0].y;
    points.forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  public isPressedPoint(x: number, y: number) {
    return pointInPolygon(x, y, this.getPoints());
  }
}
