import { Shape } from "../Shape"
import { convertToDegress } from "../helpers/convertToDegress"
import { pointInCircle } from "../helpers/pointInCircle"
import type Props from "../types/Props"

export class Wedge<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Props = Props,
  AttrsRaws extends Props = Props
> extends Shape<
  {
    angle: number
    radius: number
    clockwise?: boolean
  },
  EventsCustom,
  AttrsRefs,
  AttrsRaws
> {
  static readonly type = "Wedge"
  static readonly sizes = ["radius"]

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(
      0,
      0,
      this.attrs.radius,
      0,
      convertToDegress(this.attrs.angle),
      this.attrs.clockwise
    )
    context.lineTo(0, 0)
    this.fillStrokeScene(context)
  }

  protected size() {
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
