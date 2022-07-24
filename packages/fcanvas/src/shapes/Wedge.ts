import type { reactive } from "@vue/reactivity"

import { Shape } from "../Shape"
import { convertToDegrees } from "../helpers/convertToDegrees"
import { pointInCircle } from "../helpers/pointInCircle"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  angle: number
  radius: number
  clockwise?: boolean
}
export class Wedge extends Shape<PersonalAttrs> {
  static readonly type = "Wedge"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(
      0,
      0,
      this.$.radius,
      0,
      convertToDegrees(this.$.angle),
      this.$.clockwise
    )
    context.lineTo(0, 0)
    this.fillStrokeScene(context)
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: ReturnType<typeof reactive<CommonShapeAttrs<PersonalAttrs>>>
        ) => void
      } & ThisType<Wedge>
    >
  ) {
    super(attrs)
  }

  protected getSize() {
    return {
      width: this.$.radius * 2,
      height: this.$.radius * 2
    }
  }

  public isPressedPoint(x: number, y: number) {
    return pointInCircle(
      x,
      y,
      this.$.x,
      this.$.y,
      this.$.radius + this.getHitStroke()
    )
  }
}
