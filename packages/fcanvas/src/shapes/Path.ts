import { Shape } from "../Shape"
import { Utils } from "../Utils"
import type Props from "../types/Props"

export class Path<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Props = Props,
  AttrsRaws extends Props = Props
> extends Shape<
  {
    data: string
  },
  EventsCustom,
  AttrsRefs,
  AttrsRaws
> {
  static readonly type = "Path"
  static readonly sizes = ["data"]

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    this.fillScene(context, new Utils.Path2D(this.attrs.data))
  }
}
