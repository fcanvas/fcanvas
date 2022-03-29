import { Shape } from "../Shape";
import { Utils } from "../Utils";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  data: string;
};

export class Path<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<AttrsCustom, EventsCustom, AttrsRefs, AttrsRaws> {
  static readonly type = "Path";
  static readonly sizes = ["data"];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    this.fillScene(context, new Utils.Path2D(this.attrs.data));
  }
}
