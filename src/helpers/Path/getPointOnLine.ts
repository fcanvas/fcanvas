import { getLineLength } from "./getLineLength";

export function getPointOnLine(
  dist: number,
  P1x: number,
  P1y: number,
  P2x: number,
  P2y: number,
  fromX?: number,
  fromY?: number
) {
  if (fromX === undefined) {
    fromX = P1x;
  }
  if (fromY === undefined) {
    fromY = P1y;
  }

  const m = (P2y - P1y) / (P2x - P1x + 0.00000001);
  // eslint-disable-next-line functional/no-let
  let run = Math.sqrt((dist * dist) / (1 + m * m));
  if (P2x < P1x) {
    run *= -1;
  }
  // eslint-disable-next-line functional/no-let
  let rise = m * run;
  // eslint-disable-next-line functional/no-let
  let pt;

  if (P2x === P1x) {
    // vertical line
    pt = {
      x: fromX,
      y: fromY + rise,
    };
  } else if ((fromY - P1y) / (fromX - P1x + 0.00000001) === m) {
    pt = {
      x: fromX + run,
      y: fromY + rise,
    };
  } else {
    const len = getLineLength(P1x, P1y, P2x, P2y);
    // if (len < 0.00000001) {
    //   return {
    //     x: P1x,
    //     y: P1y,
    //   };
    // }
    // eslint-disable-next-line functional/no-let
    let u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
    u = u / (len * len);
    const ix = P1x + u * (P2x - P1x);
    const iy = P1y + u * (P2y - P1y);

    const pRise = getLineLength(fromX, fromY, ix, iy);
    const pRun = Math.sqrt(dist * dist - pRise * pRise);
    run = Math.sqrt((pRun * pRun) / (1 + m * m));
    if (P2x < P1x) {
      run *= -1;
    }
    rise = m * run;
    pt = {
      x: ix + run,
      y: iy + rise,
    };
  }

  return pt;
}
