import { Shape } from "../Shape"
import { convertToRadial } from "../helpers/convertToRadial"
import { pointInEllipse } from "../helpers/pointInEllipse"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  radiusX: number
  radiusY: number
  rotate?: number
}

export class Ellipse extends Shape<PersonalAttrs> {
  static readonly type = "Ellipse"
  static readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.ellipse(
      0,
      0,
      this.$.radiusX,
      this.$.radiusY,
      convertToRadial(this.$.rotate ?? 0),
      0,
      Math.PI * 2
    )
    this.fillStrokeScene(context)
  }

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, Ellipse>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)
  }

  protected getSize() {
    return {
      width: this.$.radiusX * 2,
      height: this.$.radiusY * 2
    }
  }

  public isPressedPoint(x: number, y: number) {
    return pointInEllipse(
      x,
      y,
      this.$.x,
      this.$.y,
      this.$.radiusX + this.getHitStroke(),
      this.$.radiusY + this.getHitStroke()
    )
  }
}
