import type { UnwrapNestedRefs } from "@vue/reactivity"

import { Shape } from "../Shape"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type PersonalAttrs = {
  points: number[]
  tension?: number
  closed?: boolean
  bezier?: boolean
}

function getControlPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  t: number
) {
  const d01 = Math.hypot(x1 - x0 + (y1 - y0))
  const d12 = Math.hypot(x2 - x1 + (y2 - y1))
  const fa = (t * d01) / (d01 + d12)
  const fb = (t * d12) / (d01 + d12)
  const p1x = x1 - fa * (x2 - x0)
  const p1y = y1 - fa * (y2 - y0)
  const p2x = x1 + fb * (x2 - x0)
  const p2y = y1 + fb * (y2 - y0)

  return [p1x, p1y, p2x, p2y]
}

function expandPoints(p: number[], tension: number) {
  const len = p.length
  const allPoints = []
  // eslint-disable-next-line functional/no-let
  let n, cp

  for (n = 2; n < len - 2; n += 2) {
    cp = getControlPoints(
      p[n - 2],
      p[n - 1],
      p[n],
      p[n + 1],
      p[n + 2],
      p[n + 3],
      tension
    )
    if (isNaN(cp[0])) continue

    allPoints.push(cp[0])

    allPoints.push(cp[1])

    allPoints.push(p[n])

    allPoints.push(p[n + 1])

    allPoints.push(cp[2])

    allPoints.push(cp[3])
  }

  return allPoints
}

export class Line<P extends PersonalAttrs = PersonalAttrs> extends Shape<P> {
  static readonly type: string = "Line"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const points = this.$.points
    const length = points.length
    const tension = this.$.tension ?? 0
    const closed = this.$.closed
    const bezier = this.$.bezier

    // eslint-disable-next-line functional/no-let
    let tp, len, n

    if (!length) return

    context.moveTo(points[0], points[1])

    // tension
    if (tension !== 0 && length > 4) {
      tp = this.getTensionPoints()
      len = tp.length
      n = closed ? 0 : 4

      if (!closed) context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3])

      while (n < len - 2) {
        context.bezierCurveTo(
          tp[n++],
          tp[n++],
          tp[n++],
          tp[n++],
          tp[n++],
          tp[n++]
        )
      }

      if (!closed) {
        context.quadraticCurveTo(
          tp[len - 2],
          tp[len - 1],
          points[length - 2],
          points[length - 1]
        )
      }
    } else if (bezier) {
      // no tension but bezier
      n = 2

      while (n < length) {
        context.bezierCurveTo(
          points[n++],
          points[n++],
          points[n++],
          points[n++],
          points[n++],
          points[n++]
        )
      }
    } else {
      // no tension

      for (n = 2; n < length; n += 2) context.lineTo(points[n], points[n + 1])
    }

    // closed e.g. polygons and blobs
    if (closed) this.strokeScene(context)
    else this.fillStrokeScene(context)
  }

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          this: Line,
          attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>
        ) => void
      } & ThisType<Line>
    >
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)
  }

  protected getTensionPoints() {
    if (this.$.closed) return this.getTensionPointsClosed()

    return expandPoints(this.$.points, this.$.tension ?? 0)
  }

  protected getTensionPointsClosed() {
    const p = this.$.points
    const len = p.length
    const tension = this.$.tension ?? 0
    const firstControlPoints = getControlPoints(
      p[len - 2],
      p[len - 1],
      p[0],
      p[1],
      p[2],
      p[3],
      tension
    )
    const lastControlPoints = getControlPoints(
      p[len - 4],
      p[len - 3],
      p[len - 2],
      p[len - 1],
      p[0],
      p[1],
      tension
    )
    const middle = expandPoints(p, tension)
    const tp = [
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
      p[1]
    ]

    return tp
  }

  public getRect() {
    // eslint-disable-next-line functional/no-let
    let points = this.$.points
    if (points.length < 4) {
      return {
        x: points[0] || 0,
        y: points[1] || 0,
        width: 0,
        height: 0
      }
    }
    if ((this.$.tension ?? 0) !== 0) {
      points = [
        points[0],
        points[1],
        ...this.getTensionPoints(),
        points[points.length - 2],
        points[points.length - 1]
      ]
    }
    // eslint-disable-next-line functional/no-let
    let minX = points[0]
    // eslint-disable-next-line functional/no-let
    let maxX = points[0]
    // eslint-disable-next-line functional/no-let
    let minY = points[1]
    // eslint-disable-next-line functional/no-let
    let maxY = points[1]
    // eslint-disable-next-line functional/no-let
    let x, y
    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < points.length / 2; i++) {
      x = points[i * 2]
      y = points[i * 2 + 1]
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }
}
