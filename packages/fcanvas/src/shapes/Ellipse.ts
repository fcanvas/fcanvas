import { Shape } from "../Shape"
import { pointInEllipse } from "../helpers/pointInEllipse"
import type { Offset } from "../types/Offset"
import type Props from "../types/Props"

export class Ellipse<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Props = Props,
  AttrsRaws extends Props = Props
> extends Shape<
  {
    radius: Offset
  },
  EventsCustom,
  AttrsRefs,
  AttrsRaws
> {
  static readonly type = "Ellipse"
  static readonly sizes = ["radius"]
  public readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.ellipse(
      0,
      0,
      0,
      this.attrs.radius.x,
      this.attrs.radius.y,
      0,
      Math.PI * 2
    )
    this.fillStrokeScene(context)
  }

  protected size() {
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
