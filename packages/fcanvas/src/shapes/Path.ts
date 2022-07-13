import { Shape } from "../Shape"

export class Path extends Shape<{
  data: string
}> {
  static readonly type = "Path"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    this.fillScene(context, new Path2D(this.$.data))
  }
}
