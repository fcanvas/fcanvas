import { calcLength } from "../helpers/Path/calcLength"
import { getPointOnQuadraticBezier } from "../helpers/Path/getPointOnQuadraticBezier"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

import type { PersonalAttrs as PersonalAttrsOfLine } from "./Line"
import { Line } from "./Line"

type PersonalAttrs = PersonalAttrsOfLine & {
  pointerLength?: number // 10
  pointerWidth?: number // 10
  pointerAtBeginning?: boolean // false
  pointerAtEnding?: boolean // true
}

/* `Arrow` is a `Line` with a `pointerLength` and `pointerWidth` attributes that draw an arrow at the
end of the line */
export class Arrow extends Line<PersonalAttrs> {
  static readonly type = "Arrow"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    super._sceneFunc(context)

    context.setLineDash([])

    const PI2 = Math.PI * 2
    const points = this.$.points

    // eslint-disable-next-line functional/no-let
    let tp = points
    const fromTension = (this.$.tension ?? 0) !== 0 && points.length > 4
    if (fromTension) tp = this.getTensionPoints()

    const length = this.$.pointerLength ?? 10

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

    const width = this.$.pointerWidth ?? 10

    if (this.$.pointerAtEnding !== false) {
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

    if (this.$.pointerAtBeginning) {
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

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, Arrow>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)
  }

  public getRect() {
    const lineRect = super.getRect()
    const offset = (this.$.pointerWidth ?? 10) / 2
    return {
      x: lineRect.x - offset,
      y: lineRect.y - offset,
      width: lineRect.width + offset * 2,
      height: lineRect.height + offset * 2
    }
  }
}
