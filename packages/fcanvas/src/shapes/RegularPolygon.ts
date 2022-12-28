import type { UnwrapNestedRefs } from "@vue/reactivity"

import { Shape } from "../Shape"
import { pointInPolygon } from "../helpers/pointInPolygon"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  sides: number
  radius: number
}
export class RegularPolygon extends Shape<PersonalAttrs> {
  static readonly type = "RegularPolygon"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const points = this.getPoints()

    context.moveTo(points[0].x, points[0].y)

    // eslint-disable-next-line functional/no-let
    for (let n = 1; n < points.length; n++)
      context.lineTo(points[n].x, points[n].y)

    this.fillStrokeScene(context)
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>
        ) => void
      } & ThisType<RegularPolygon>
    >
  ) {
    super(attrs)
  }

  private getPoints() {
    const { sides, radius } = this.$
    const points = []
    // eslint-disable-next-line functional/no-let
    for (let n = 0; n < sides; n++) {
      points.push({
        x: radius * Math.sin((n * 2 * Math.PI) / sides),
        y: -1 * radius * Math.cos((n * 2 * Math.PI) / sides)
      })
    }
    return points
  }

  public getRect() {
    const points = this.getPoints()

    // eslint-disable-next-line functional/no-let
    let minX = points[0].x
    // eslint-disable-next-line functional/no-let
    let maxX = points[0].y
    // eslint-disable-next-line functional/no-let
    let minY = points[0].x
    // eslint-disable-next-line functional/no-let
    let maxY = points[0].y
    points.forEach((point) => {
      minX = Math.min(minX, point.x)
      maxX = Math.max(maxX, point.x)
      minY = Math.min(minY, point.y)
      maxY = Math.max(maxY, point.y)
    })
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }

  public isPressedPoint(x: number, y: number) {
    return pointInPolygon(x, y, this.getPoints())
  }
}
