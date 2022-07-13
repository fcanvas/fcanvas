import { Shape } from "../Shape"
import { convertToDegrees } from "../helpers/convertToDegrees"
import { pointInCircle } from "../helpers/pointInCircle"

export class Wedge extends Shape<{
  angle: number
  radius: number
  clockwise?: boolean
}> {
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
