import { calcLength } from "../helpers/Path/calcLength"
import { getPointOnQuadraticBezier } from "../helpers/Path/getPointOnQuadraticBezier"

import type { AttrsCustom as AttrsCustomLine } from "./Line"
import { Line } from "./Line"

type AttrsCustom = AttrsCustomLine & {
  pointerLength?: number // 10

  pointerWidth?: number // 10

  pointerAtBeginning?: boolean // false

  pointerAtEnding?: boolean // true
}

export class Arrow<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Line<EventsCustom, AttrsCustom, AttrsRefs, AttrsRaws> {
  static readonly type = "Arrow"
  static readonly sizes = [
    ...Line.sizes,
    "pointerLength",
    "pointerWidth",
    "pointerAtBeginning",
    "pointerAtEnding"
  ]

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    super._sceneFunc(context)
    const PI2 = Math.PI * 2
    const points = this.attrs.points

    // eslint-disable-next-line functional/no-let
    let tp = points
    const fromTension = (this.attrs.tension ?? 0) !== 0 && points.length > 4
    if (fromTension) tp = this.getTensionPoints()

    const length = this.attrs.pointerLength ?? 10

    const n = points.length

    // eslint-disable-next-line functional/no-let
    let dx, dy
    if (fromTension) {
      const lp = [
        tp[tp.length - 4],
        tp[tp.length - 3],
        tp[tp.length - 2],
        tp[tp.length - 1],
        points[n - 2],
        points[n - 1]
      ]
      const lastLength = calcLength(
        tp[tp.length - 4],
        tp[tp.length - 3],
        "C",
        lp
      )
      const previous = getPointOnQuadraticBezier(
        Math.min(1, 1 - length / lastLength),
        lp[0],
        lp[1],
        lp[2],
        lp[3],
        lp[4],
        lp[5]
      )

      dx = points[n - 2] - previous.x
      dy = points[n - 1] - previous.y
    } else {
      dx = points[n - 2] - points[n - 4]
      dy = points[n - 1] - points[n - 3]
    }

    const radians = (Math.atan2(dy, dx) + PI2) % PI2

    const width = this.attrs.pointerWidth ?? 10

    if (this.attrs.pointerAtEnding !== false) {
      context.save()
      context.beginPath()
      context.translate(points[n - 2], points[n - 1])
      context.rotate(radians)
      context.moveTo(0, 0)
      context.lineTo(-length, width / 2)
      context.lineTo(-length, -width / 2)
      context.closePath()
      this.fillStrokeScene(context)
      context.restore()
    }

    if (this.attrs.pointerAtBeginning) {
      context.save()
      context.beginPath()
      context.translate(points[0], points[1])
      if (fromTension) {
        dx = (tp[0] + tp[2]) / 2 - points[0]
        dy = (tp[1] + tp[3]) / 2 - points[1]
      } else {
        dx = points[2] - points[0]
        dy = points[3] - points[1]
      }

      context.rotate((Math.atan2(-dy, -dx) + PI2) % PI2)
      context.moveTo(0, 0)
      context.lineTo(-length, width / 2)
      context.lineTo(-length, -width / 2)
      context.closePath()
      this.fillStrokeScene(context)
      context.restore()
    }
  }

  public getSelfRect() {
    const lineRect = super.getSelfRect()
    const offset = (this.attrs.pointerWidth ?? 10) / 2
    return {
      x: lineRect.x - offset,
      y: lineRect.y - offset,
      width: lineRect.width + offset * 2,
      height: lineRect.height + offset * 2
    }
  }
}
