import { Shape } from "../Shape";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  data: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export class Path<EventsCustom extends Record<string, any> = {}> extends Shape<
  AttrsCustom,
  EventsCustom
> {
  static readonly type = "Path";
  static readonly attrsReactSize = ["data"];

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    this.fillScene(context, new Path2D(this.attrs.data));
  }
}
