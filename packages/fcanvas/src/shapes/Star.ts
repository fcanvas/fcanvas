import { Shape } from "../Shape"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  numPoints: number
  innerRadius: number
  outerRadius: number
}

export class Star extends Shape<PersonalAttrs> {
  static readonly type = "Star"
  static readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const { innerRadius, outerRadius, numPoints } = this.$

    context.moveTo(0, 0 - outerRadius)

    // eslint-disable-next-line functional/no-let
    for (let n = 1; n < numPoints * 2; n++) {
      const radius = n % 2 === 0 ? outerRadius : innerRadius
      const x = radius * Math.sin((n * Math.PI) / numPoints)
      const y = -1 * radius * Math.cos((n * Math.PI) / numPoints)
      context.lineTo(x, y)
    }
    context.closePath()

    this.fillStrokeScene(context)
  }

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, Star>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)
  }

  protected getSize() {
    const size = this.$.outerRadius * 2
    return {
      width: size,
      height: size
    }
  }
}
