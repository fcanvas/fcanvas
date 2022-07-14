import { Shape } from "../Shape"
import { convertToRadial } from "../helpers/convertToRadial"
import { pointInCircle } from "../helpers/pointInCircle"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type PersonalAttrs = {
  angle?: number
  innerRadius: number
  outerRadius: number
  clockwise?: boolean
}

export class Arc extends Shape<PersonalAttrs> {
  static readonly type: string = "Arc"
  static readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const angle = convertToRadial(this.$.angle ?? 360)

    context.arc(0, 0, this.$.outerRadius, 0, angle, this.$.clockwise)
    context.arc(0, 0, this.$.innerRadius, angle, 0, !this.$.clockwise)
    context.closePath()

    this.fillStrokeScene(context)
  }

  protected getSize() {
    return {
      width: this.$.outerRadius * 2,
      height: this.$.outerRadius * 2
    }
  }

  public isPressedPoint(x: number, y: number) {
    return (
      !pointInCircle(x, y, this.$.x, this.$.y, this.$.innerRadius) &&
      pointInCircle(
        x,
        y,
        this.$.x,
        this.$.y,
        this.$.outerRadius + this.getHitStroke()
      )
    )
  }
}
