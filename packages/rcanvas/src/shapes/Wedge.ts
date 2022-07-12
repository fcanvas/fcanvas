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
      this.attrs.radius,
      0,
      convertToDegrees(this.attrs.angle),
      this.attrs.clockwise
    )
    context.lineTo(0, 0)
    this.fillStrokeScene(context)
  }

  protected getSize() {
    return {
      width: this.attrs.radius * 2,
      height: this.attrs.radius * 2
    }
  }

  public isPressedPoint(x: number, y: number) {
    return pointInCircle(
      x,
      y,
      this.attrs.x,
      this.attrs.y,
      this.attrs.radius + this.getHitStroke()
    )
  }
}
