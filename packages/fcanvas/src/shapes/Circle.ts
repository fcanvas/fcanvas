import type { reactive } from "@vue/reactivity"

import { Shape } from "../Shape"
import { pointInCircle } from "../helpers/pointInCircle"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  radius: number
}
export class Circle extends Shape<PersonalAttrs> {
  static readonly type = "Circle"
  static readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(0, 0, this.$.radius, 0, Math.PI * 2)
    this.fillStrokeScene(context)
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: ReturnType<typeof reactive<CommonShapeAttrs<PersonalAttrs>>>
        ) => void
      } & ThisType<Circle>
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
    // check
    return pointInCircle(x, y, this.$.x, this.$.y, this.$.radius)
  }
}
