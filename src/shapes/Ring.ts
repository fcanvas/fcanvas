import { Arc, AttrsCustom as AttrsArc } from "./Arc";

type AttrsCustom = Omit<AttrsArc, "angle">;

const PIx2 = Math.PI * 2;
export class Ring<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Arc<EventsCustom, AttrsCustom, AttrsRefs, AttrsRaws> {
  static readonly type = "Ring";
  static readonly sizes = ["innerRadius", "outerRadius", "clockwise"];
  public readonly _centroid = true;

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.arc(0, 0, this.attrs.innerRadius, 0, PIx2, false);
    context.moveTo(this.attrs.outerRadius, 0);
    context.arc(0, 0, this.attrs.outerRadius, PIx2, 0, true);

    this.fillStrokeScene(context);
  }
}