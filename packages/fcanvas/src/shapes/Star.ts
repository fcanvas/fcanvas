import type { reactive } from "@vue/reactivity"

import { Shape } from "../Shape"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  numPoints: number
  innerRadius: number
  outerRadius: number
}

export class Star extends Shape<PersonalAttrs> {
  static readonly type = "Star"

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

    this.fillStrokeScene(context)
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: ReturnType<typeof reactive<CommonShapeAttrs<PersonalAttrs>>>
        ) => void
      } & ThisType<Star>
    >
  ) {
    super(attrs)
  }

  protected getSize() {
    return {
      width: this.$.outerRadius * 2,
      height: this.$.outerRadius * 2
    }
  }
}