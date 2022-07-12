import { Arc } from "./Arc"

const PIx2 = Math.PI * 2
export class Ring extends Arc {
  static readonly type = "Ring"
  static readonly _centroid = true

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(0, 0, this.attrs.innerRadius, 0, PIx2, false)
    context.moveTo(this.attrs.outerRadius, 0)
    context.arc(0, 0, this.attrs.outerRadius, PIx2, 0, true)

    this.fillStrokeScene(context)
  }
}
