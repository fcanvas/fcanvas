import { Shape } from "../Shape"
import { convertToRadial } from "../helpers/convertToRadial"
import { pointInCircle } from "../helpers/pointInCircle"
import type Props from "../types/Props"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AttrsCustom = {
  angle: number
  innerRadius: number
  outerRadius: number
  clockwise?: boolean
}

export class Arc<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsCustomMore extends Props & Omit<AttrsCustom, "angle"> = AttrsCustom,
  AttrsRefs extends Props = Props,
  AttrsRaws extends Props = Props
> extends Shape<AttrsCustomMore, EventsCustom, AttrsRefs, AttrsRaws> {
  static readonly type: string = "Arc"

  static readonly sizes: string[] = [
    "angle",
    "innerRadius",
    "outerRadius",
    "clockwise"
  ]

  public readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const angle = convertToRadial((this.attrs.angle as number) ?? 360)

    context.arc(0, 0, this.attrs.outerRadius, 0, angle, this.attrs.clockwise)
    context.arc(0, 0, this.attrs.innerRadius, angle, 0, !this.attrs.clockwise)

    this.fillStrokeScene(context)
  }

  protected size() {
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
