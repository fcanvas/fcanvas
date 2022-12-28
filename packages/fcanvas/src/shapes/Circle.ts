import type { UnwrapNestedRefs } from "@vue/reactivity"

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

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          this: Circle,
          attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>
        ) => void
      } & ThisType<Circle>
    >
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)
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
