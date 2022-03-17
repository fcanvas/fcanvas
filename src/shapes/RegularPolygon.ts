type Attrs = {
  sides: number;
  radius: number
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export class RegularPolygon<EventsCustom extends Record<string, any> = {}> extends Shape<
  AttrsCustom,
  EventsCustom
> {
  static readonly type = "RegularPolygon";
static readonly attrsReactSize = [
 
    "sides",
    "radius"
  ];
  
  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const points = this.getPoints();

    context.moveTo(points[0].x, points[0].y);

    for (let n = 1; n < points.length; n++) {
      context.lineTo(points[n].x, points[n].y);
    }

    this.fillStrokeScene(context);
  }
  private getPoints() {
    const sides = this.attrs.sides;
    const radius = this.attrs.radius;
    const points = [];
    for (let n = 0; n < sides; n++) {
      points.push({
        x: radius * Math.sin((n * 2 * Math.PI) / sides),
        y: -1 * radius * Math.cos((n * 2 * Math.PI) / sides),
      });
    }
    return points;
  }
  public getSelfRect() {
    const points = this.getPoints();

    let minX = points[0].x;
    let maxX = points[0].y;
    let minY = points[0].x;
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
