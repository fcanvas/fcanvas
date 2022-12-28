import type { UnwrapNestedRefs } from "@vue/reactivity"

import { Shape } from "../Shape"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  width: number
  height: number
  cornerRadius?: number | [number, number] | [number, number, number, number]
}

export class Rect extends Shape<PersonalAttrs> {
  static readonly type = "Rect"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.$.cornerRadius) {
      // eslint-disable-next-line functional/no-let
      let r1 = 0
      // eslint-disable-next-line functional/no-let
      let r2 = 0
      // eslint-disable-next-line functional/no-let
      let r3 = 0
      // eslint-disable-next-line functional/no-let
      let r4 = 0
      const ws2 = this.$.width / 2
      const hs2 = this.$.height / 2
      if (typeof this.$.cornerRadius === "number") {
        r1 = Math.min(this.$.cornerRadius, ws2, hs2)
        r2 = r1
        r3 = r1
        r4 = r1
      } else if (this.$.cornerRadius.length === 2) {
        r1 = Math.min(this.$.cornerRadius[0], ws2, hs2)
        r3 = r1
        r2 = Math.min(this.$.cornerRadius[1], ws2, hs2)
        r4 = r2
      } else {
        ;[r1, r2, r3, r4] = [
          Math.min(this.$.cornerRadius[0], ws2, hs2),
          Math.min(this.$.cornerRadius[1], ws2, hs2),
          Math.min(this.$.cornerRadius[2], ws2, hs2),
          Math.min(this.$.cornerRadius[3], ws2, hs2)
        ]
      }

      context.moveTo(0, 0)
      context.arcTo(this.$.width, 0, this.$.width, this.$.height - r2, r2)
      context.arcTo(
        this.$.width,
        this.$.height,
        this.$.width - r3,
        this.$.height,
        r3
      )
      context.arcTo(0, this.$.height, 0, this.$.height - r4, r4)
      context.arcTo(0, 0, this.$.width - r1, 0, r1)

      this.fillStrokeScene(context)
    } else {
      context.rect(0, 0, this.$.width, this.$.height)
      this.fillStrokeScene(context)
    }
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>
        ) => void
      } & ThisType<Rect>
    >
  ) {
    super(attrs)
  }
}
