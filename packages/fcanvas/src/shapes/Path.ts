import type { UnwrapNestedRefs } from "@vue/reactivity"

import { Shape } from "../Shape"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  data: string
}
export class Path extends Shape<PersonalAttrs> {
  static readonly type = "Path"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    this.fillScene(context, new Path2D(this.$.data))
  }

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          this: Path,
          attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>
        ) => void
      } & ThisType<Path>
    >
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)
  }
}
