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

  // eslint-disable-next-line no-useless-constructor
  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>
        ) => void
      } & ThisType<Path>
    >
  ) {
    super(attrs)
  }
}
