import { Shape } from "../Shape"
import { pointInEllipse } from "../helpers/pointInEllipse"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  radius: {
    x: number
    y: number
  }
  rotate?: number
}

export class Ellipse extends Shape<PersonalAttrs> {
  static readonly type = "Ellipse"
  static readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.ellipse(
      0,
      0,
      this.attrs.radius.x,
      this.attrs.radius.y,
      this.attrs.rotate ?? 0,
      0,
      Math.PI * 2
    )
    this.fillStrokeScene(context)
  }

  protected getSize() {
    return {
      width: this.attrs.radius.x * 2,
      height: this.attrs.radius.y * 2
    }
  }

  public isPressedPoint(x: number, y: number) {
    return pointInEllipse(
      x,
      y,
      this.attrs.x,
      this.attrs.y,
      this.attrs.radius.x + this.getHitStroke(),
      this.attrs.radius.y + this.getHitStroke()
    )
  }
}
