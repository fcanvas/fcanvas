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
    const angle = convertToRadial((this.attrs.angle) ?? 360)

    context.arc(0, 0, this.attrs.outerRadius, 0, angle, this.attrs.clockwise)
    this.fillStrokeScene(context)
    context.closePath()

    context.beginPath()
    context.arc(0, 0, this.attrs.innerRadius, angle, 0, !this.attrs.clockwise)
    this.fillStrokeScene(context)
  }

  protected getSize() {
    return {
      width: this.attrs.outerRadius * 2,
      height: this.attrs.outerRadius * 2
    }
  }

  public isPressedPoint(x: number, y: number) {
    return (
      !pointInCircle(
        x,
        y,
        this.attrs.x,
        this.attrs.y,
        this.attrs.innerRadius
      ) &&
      pointInCircle(
        x,
        y,
        this.attrs.x,
        this.attrs.y,
        this.attrs.outerRadius + this.getHitStroke()
      )
    )
  }
}
