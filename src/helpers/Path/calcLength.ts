import { getLineLength } from "./getLineLength";
import { getPointOnCubicBezier } from "./getPointOnCubicBezier";
import { getPointOnEllipticalArc } from "./getPointOnEllipticalArc";
import { getPointOnQuadraticBezier } from "./getPointOnQuadraticBezier";

// eslint-disable-next-line functional/prefer-readonly-type
export function calcLength(
  x: number,
  y: number,
  cmd: "L" | "C" | "Q" | "A",
  points: number[]
) {
  // eslint-disable-next-line functional/no-let
  let len, p1, p2, t;

  switch (cmd) {
    case "L":
      return getLineLength(x, y, points[0], points[1]);
    case "C":
      // Approximates by breaking curve into 100 line segments
      len = 0.0;
      p1 = getPointOnCubicBezier(
        0,
        x,
        y,
        points[0],
        points[1],
        points[2],
        points[3],
        points[4],
        points[5]
      );
      // eslint-disable-next-line functional/no-loop-statement
      for (t = 0.01; t <= 1; t += 0.01) {
        p2 = getPointOnCubicBezier(
          t,
          x,
          y,
          points[0],
          points[1],
          points[2],
          points[3],
          points[4],
          points[5]
        );
        len += getLineLength(p1.x, p1.y, p2.x, p2.y);
        p1 = p2;
      }
      return len;
    case "Q":
      // Approximates by breaking curve into 100 line segments
      len = 0.0;
      p1 = getPointOnQuadraticBezier(
        0,
        x,
        y,
        points[0],
        points[1],
        points[2],
        points[3]
      );
      // eslint-disable-next-line functional/no-loop-statement
      for (t = 0.01; t <= 1; t += 0.01) {
        p2 = getPointOnQuadraticBezier(
          t,
          x,
          y,
          points[0],
          points[1],
          points[2],
          points[3]
        );
        len += getLineLength(p1.x, p1.y, p2.x, p2.y);
        p1 = p2;
      }
      return len;
    case "A":
      // Approximates by breaking curve into line segments
      len = 0.0;
      // eslint-disable-next-line no-case-declarations
      const start = points[4];
      // 4 = theta
      // eslint-disable-next-line no-case-declarations
      const dTheta = points[5];
      // 5 = dTheta
      // eslint-disable-next-line no-case-declarations
      const end = points[4] + dTheta;
      // eslint-disable-next-line no-case-declarations, functional/no-let
      let inc = Math.PI / 180.0;
      // 1 degree resolution
      if (Math.abs(start - end) < inc) {
        inc = Math.abs(start - end);
      }
      // Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi
      p1 = getPointOnEllipticalArc(
        points[0],
        points[1],
        points[2],
        points[3],
        start,
        0
      );
      if (dTheta < 0) {
        // clockwise
        // eslint-disable-next-line functional/no-loop-statement
        for (t = start - inc; t > end; t -= inc) {
          p2 = getPointOnEllipticalArc(
            points[0],
            points[1],
            points[2],
            points[3],
            t,
            0
          );
          len += getLineLength(p1.x, p1.y, p2.x, p2.y);
          p1 = p2;
        }
      } else {
        // counter-clockwise
        // eslint-disable-next-line functional/no-loop-statement
        for (t = start + inc; t < end; t += inc) {
          p2 = getPointOnEllipticalArc(
            points[0],
            points[1],
            points[2],
            points[3],
            t,
            0
          );
          len += getLineLength(p1.x, p1.y, p2.x, p2.y);
          p1 = p2;
        }
      }
      p2 = getPointOnEllipticalArc(
        points[0],
        points[1],
        points[2],
        points[3],
        end,
        0
      );
      len += getLineLength(p1.x, p1.y, p2.x, p2.y);

      return len;
  }
}
