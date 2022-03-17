import { AttrsCustom as AttrsArc, Arc } from "./Arc";
import { convertToRadial } from "../helpers/convertToRadial";

type AttrsCustom = Omit<AttrsArc, "angle">

const PIx2 = Math.PI * 2;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export class Ring<EventsCustom extends Record<string, any> = {}> extends Arc<
  EventsCustom,
  AttrsCustom
> {
  static readonly type = "Ring";
  static readonly attrsReactSize = [
    "innerRadius",
    "outerRadius",
    "clockwise",
  ];
  public readonly _centroid = true;

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const angle = convertToRadial(this.attrs.angle)
    
    context.arc(0, 0, this.attrs.innerRadius, 0, PIx2, false);
    context.moveTo(this.attrs.outerRadius, 0);
    context.arc(0, 0, this.attrs.outerRadius, PIx2, 0, true);
  
    this.fillStrokeScene(context);
  }
}
