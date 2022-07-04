import { Shape } from "../Shape"
import { pointInCircle } from "../helpers/pointInCircle"

export class Circle extends Shape<{
  radius: number
}> {
  static readonly type = "Circle"
  static readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(0, 0, this.attrs.radius, 0, Math.PI * 2)
    this.fillStrokeScene(context)
  }

  protected getSize() {
    return {
      width: this.attrs.radius * 2,
      height: this.attrs.radius * 2
    }
  }

  public isPressedPoint(x: number, y: number) {
    // check
    return pointInCircle(x, y, this.attrs.x, this.attrs.y, this.attrs.radius)
  }
}
