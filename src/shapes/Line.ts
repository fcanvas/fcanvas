import { Shape } from "../Shape";

export type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  points: number[];
  // eslint-disable-next-line functional/prefer-readonly-type
  tension?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  closed?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  bezier?: boolean;
};

function getControlPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  t: number
) {
  const d01 = Math.hypot(x1 - x0 + (y1 - y0)),
    d12 = Math.hypot(x2 - x1 + (y2 - y1)),
    fa = (t * d01) / (d01 + d12),
    fb = (t * d12) / (d01 + d12),
    p1x = x1 - fa * (x2 - x0),
    p1y = y1 - fa * (y2 - y0),
    p2x = x1 + fb * (x2 - x0),
    p2y = y1 + fb * (y2 - y0);

  return [p1x, p1y, p2x, p2y];
}

// eslint-disable-next-line functional/prefer-readonly-type
function expandPoints(p: number[], tension: number) {
  const len = p.length,
    allPoints = [];
  // eslint-disable-next-line functional/no-let
  let n, cp;

  // eslint-disable-next-line functional/no-loop-statement
  for (n = 2; n < len - 2; n += 2) {
    cp = getControlPoints(
      p[n - 2],
      p[n - 1],
      p[n],
      p[n + 1],
      p[n + 2],
      p[n + 3],
      tension
    );
    if (isNaN(cp[0])) {
      continue;
    }
    // eslint-disable-next-line functional/immutable-data
    allPoints.push(cp[0]);
    // eslint-disable-next-line functional/immutable-data
    allPoints.push(cp[1]);
    // eslint-disable-next-line functional/immutable-data
    allPoints.push(p[n]);
    // eslint-disable-next-line functional/immutable-data
    allPoints.push(p[n + 1]);
    // eslint-disable-next-line functional/immutable-data
    allPoints.push(cp[2]);
    // eslint-disable-next-line functional/immutable-data
    allPoints.push(cp[3]);
  }

  return allPoints;
}

export class Line<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsCustomMore extends Record<string, unknown> &
    Omit<AttrsCustom, "closed"> = AttrsCustom,
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<AttrsCustomMore, EventsCustom, AttrsRefs, AttrsRaws> {
  static readonly type: string = "Line";
  static readonly sizes: readonly string[] = [
    "points",
    "tension",
    "bezier",
    "closed",
  ];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const points = this.attrs.points,
      length = points.length,
      tension = this.attrs.tension ?? 0,
      closed = this.attrs.closed,
      bezier = this.attrs.bezier;

    // eslint-disable-next-line functional/no-let
    let tp, len, n;

    if (!length) {
      return;
    }

    if (this.attrs.x || this.attrs.y) {
      context.translate(this.attrs.x, this.attrs.y);
    }
    context.moveTo(points[0], points[1]);

    // tension
    if (tension !== 0 && length > 4) {
      tp = this.getTensionPoints();
      len = tp.length;
      n = closed ? 0 : 4;

      if (!closed) {
        context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
      }

      // eslint-disable-next-line functional/no-loop-statement
      while (n < len - 2) {
        context.bezierCurveTo(
          tp[n++],
          tp[n++],
          tp[n++],
          tp[n++],
          tp[n++],
          tp[n++]
        );
      }

      if (!closed) {
        context.quadraticCurveTo(
          tp[len - 2],
          tp[len - 1],
          points[length - 2],
          points[length - 1]
        );
      }
    } else if (bezier) {
      // no tension but bezier
      n = 2;

      // eslint-disable-next-line functional/no-loop-statement
      while (n < length) {
        context.bezierCurveTo(
          points[n++],
          points[n++],
          points[n++],
          points[n++],
          points[n++],
          points[n++]
        );
      }
    } else {
      // no tension
      // eslint-disable-next-line functional/no-loop-statement
      for (n = 2; n < length; n += 2) {
        context.lineTo(points[n], points[n + 1]);
      }
    }

    // closed e.g. polygons and blobs
    if (closed) {
      this.strokeScene(context);
    } else {
      this.fillStrokeScene(context);
    }

    if (this.attrs.x || this.attrs.y) {
      context.translate(-this.attrs.x, -this.attrs.y);
    }
  }

  protected getTensionPoints() {
    if (this.attrs.closed) {
      return this.getTensionPointsClosed();
    } else {
      return expandPoints(this.attrs.points, this.attrs.tension ?? 0);
    }
  }
  protected getTensionPointsClosed() {
    const p = this.attrs.points,
      len = p.length,
      tension = this.attrs.tension ?? 0,
      firstControlPoints = getControlPoints(
        p[len - 2],
        p[len - 1],
        p[0],
        p[1],
        p[2],
        p[3],
        tension
      ),
      lastControlPoints = getControlPoints(
        p[len - 4],
        p[len - 3],
        p[len - 2],
        p[len - 1],
        p[0],
        p[1],
        tension
      ),
      middle = expandPoints(p, tension),
      tp = [
        firstControlPoints[2],
        firstControlPoints[3],
        ...middle,
        lastControlPoints[0],
        lastControlPoints[1],
        p[len - 2],
        p[len - 1],
        lastControlPoints[2],
        lastControlPoints[3],
        firstControlPoints[0],
        firstControlPoints[1],
        p[0],
        p[1],
      ];

    return tp;
  }

  public getSelfRect() {
    // eslint-disable-next-line functional/no-let
    let points = this.attrs.points;
    if (points.length < 4) {
      return {
        x: points[0] || 0,
        y: points[1] || 0,
        width: 0,
        height: 0,
      };
    }
    if ((this.attrs.tension ?? 0) !== 0) {
      points = [
        points[0],
        points[1],
        ...this.getTensionPoints(),
        points[points.length - 2],
        points[points.length - 1],
      ];
    }
    // eslint-disable-next-line functional/no-let
    let minX = points[0];
    // eslint-disable-next-line functional/no-let
    let maxX = points[0];
    // eslint-disable-next-line functional/no-let
    let minY = points[1];
    // eslint-disable-next-line functional/no-let
    let maxY = points[1];
    // eslint-disable-next-line functional/no-let
    let x, y;
    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let i = 0; i < points.length / 2; i++) {
      x = points[i * 2];
      y = points[i * 2 + 1];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}
